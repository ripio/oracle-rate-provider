const MarketsManager = require('./MarketsManager.js');
const storage = require('node-persist');
const MultiSourceOracle = require('./contracts/MultiSourceOracle.js');
const OracleFactory = require('./contracts/OracleFactory.js');

const routes = require('../environment/routes.js');
const constants = require('../environment/constants.js');

const logger = require('./logger.js');
const bn = require('./bn.js');

module.exports = class Provider {
  constructor(w3, options) {
    // Context
    this.w3 = w3;
    this.options = options;
    this.routes = routes[options.network];
    this.symbols = options.currencies.split(',');
    this.baseCurrency = constants[options.network].baseCurrency;
    // Contracts
    this.oracleFactory = new w3.eth.Contract(OracleFactory.abi, options.oracleFactoryContract);
    // Variables
    this.MarketsManager = null;
    this.ratesProvided = [];
    this.ratesToProvide = [];
  }

  toUint96(number) {
    const hex = number.toString(16);
    return `0x${'0'.repeat(24 - hex.length)}${hex}`;
  }

  logRates(providedData, signer) {
    for (var currencyData of providedData) {
      const log = 'Provide(signer: ' + signer.address + ',  oracle: ' + currencyData.oracle + ',  rate: ' + currencyData.rate + ')';
      logger.info(log);
    }
  }

  logRatesToProvide() {
    for (var provideRate of this.ratesToProvide) {
      const log = 'Providing Median Rate for ' + this.baseCurrency + '/' + provideRate.symbol + ': ' + provideRate.rate;
      logger.info(log);
    }
  }

  logMarketMedianRates() {
    for (var currencyData of this.ratesProvided) {
      const log = 'Median Rate ' + currencyData.currency_from + '/' + currencyData.currency_to + ': ' + currencyData.rate + ' from markets: ' + currencyData.markets;
      logger.info(log);
    }
  }

  async init() {
    this.MarketsManager = await new MarketsManager(this.w3).init();
    this.oracles = await this.loadOracles(this.symbols);
    return this;
  }

  async loadOracles(symbols) {
    const oracles = [];

    logger.info('Loading oracles:');

    for (const symbol of symbols) {
      const oracleAddr = await this.oracleFactory.methods.symbolToOracle(symbol).call();

      if (oracleAddr === '0x0000000000000000000000000000000000000000') {
        logger.info('\tCurrency: ' + symbol + ', the oracle dont exists');
      } else {
        const oracle = new this.w3.eth.Contract(MultiSourceOracle.abi, oracleAddr);
        oracles[symbol] = oracle;
        logger.info('\tCurrency: ' + symbol + ', Address: ' + oracleAddr);
      }
    }

    return oracles;
  }

  async getMedian(rates) {
    var median = 0, rateLen = rates.length;

    if (!rateLen)
      return undefined;

    rates.sort();

    if (rateLen % 2 === 0) {
      const num1 = bn(rates[bn(rateLen).div(bn(2)) - 1]);
      const num2 = bn(rates[bn(rateLen).div(bn(2))]);

      median = (num1.add(num2)).div(bn(2)).toString();
    } else {
      median = rates[(rateLen - 1) / 2];
    }

    return median;
  }

  async getMedianFromMarkets(currencydata) {
    const marketManager = this.MarketsManager;

    let rates = [];

    // Get median from market rates
    for (var exchange of currencydata.exchangesIds) {
      const rateData = {
        currency_from: currencydata.currency_from,
        currency_to: currencydata.currency_to,
        exchangeId: exchange,
        decimals: currencydata.decimals
      };
      const rate = await marketManager.getRate(rateData);
      if (rate) { rates.push(rate); }
    }

    let medianRate;
    if (rates.length > 0) {
      medianRate = await this.getMedian(rates);
      if (!medianRate) {
        logger.info('Dont have rates');
        return;
      }
    } else {
      medianRate = 0;
    }

    logger.info('Median Rate ' + currencydata.currency_from + '/' + currencydata.currency_to + ': ' + medianRate);

    const rateProvided = {
      currency_from: currencydata.currency_from,
      currency_to: currencydata.currency_to,
      rate: medianRate,
      markets: currencydata.exchangesIds,
      decimals: currencydata.decimals
    };

    this.ratesProvided.push(rateProvided);
  }

  async getMarketsRates() {

    logger.info('Gathering Market data...');

    for (var pair of this.routes) {
      await this.getMedianFromMarkets(pair);
    }
  }

  async getPairsFrom(to) {
    const marketRates = this.ratesProvided;
    let pairsFrom = [];

    for (var mkr of marketRates) {
      if (mkr.currency_to == to) {
        pairsFrom.push(mkr.currency_from);
      }
    }
    return pairsFrom;
  }

  async getPairsTo(from) {
    const marketRates = this.ratesProvided;
    let pairsTo = [];

    for (var mkr of marketRates) {
      if (mkr.currency_from == from) {
        pairsTo.push(mkr.currency_to);
      }
    }
    return pairsTo;
  }

  async getPair(from, to) {
    const marketRates = this.ratesProvided;

    for (var mkr of marketRates) {
      if (mkr.currency_from == from && mkr.currency_to == to) {
        return mkr;
      }
      if (mkr.currency_from == to && mkr.currency_to == from) {
        return mkr;
      }
    }
    return {};
  }

  async getIntersection(pairsToPrimary, pairsFromSymbol) {
    const matchCurrency = pairsToPrimary.filter(c => pairsFromSymbol.includes(c));
    return matchCurrency;
  }

  async getIndirectRate(symbol) {
    const pairsToPrimary = await this.getPairsTo(this.baseCurrency);
    const pairsFromSymbol = await this.getPairsFrom(symbol);
    const pairsToSymbol = await this.getPairsTo(symbol);
    let matchPairTo = false;

    let getIntersection = await this.getIntersection(pairsToPrimary, pairsFromSymbol);

    if (getIntersection.length == 0) {
      getIntersection = await this.getIntersection(pairsToPrimary, pairsToSymbol);
      matchPairTo = true;
    }

    if (getIntersection.length > 0) {
      const matchSymbol = getIntersection[0];
      const ratePrimary = await this.getPair(this.baseCurrency, matchSymbol);
      const rateSymbol = await this.getPair(matchSymbol, symbol);
      let medianRate;

      if (!matchPairTo) {
        medianRate = bn(ratePrimary.rate).mul(bn(rateSymbol.rate)).div(bn(10 ** rateSymbol.decimals)).toString();
      } else {
        if (rateSymbol.rate != 0) {
          medianRate = bn(ratePrimary.rate).mul(bn(10 ** rateSymbol.decimals)).div(bn(rateSymbol.rate)).toString();
        } else {
          medianRate = 0;
        }
      }
      return medianRate;
    } else {
      for (var cp of pairsToPrimary) {
        for (var cs of pairsFromSymbol) {
          const pair = await this.getPair(cp, cs);
          if (pair.rate != undefined) {
            const primaryRate = await this.getPair(this.baseCurrency, cp);
            const symbolRate = await this.getPair(cs, symbol);
            const intermidateRate = pair.rate;

            const medianRate = bn(primaryRate.rate).mul(bn(symbolRate.rate)).mul(bn(intermidateRate)).toString();
            const medianRateDecimals = bn(medianRate).div(bn(10 ** symbolRate.decimals)).div(bn(10 ** pair.decimals)).toString();
            return medianRateDecimals;
          }
        }
      }
    }

    const err = '';
    return err;
  }


  async getOraclesRatesData() {
    for (var symbol of this.symbols) {
      try {
        let medianRate;

        // Check currency
        if (!this.oracles[symbol]) {
          logger.info('Wrong currency: ' + symbol);
        }
        // Check address
        const address = this.oracles[symbol]._address;
        if (!address) {
          logger.info('Wrong address: ' + address);
        }
        // Check decimals
        const decimals = await this.oracles[symbol].methods.decimals().call();
        if (!decimals) {
          logger.info('Wrong decimals: ' + decimals);
        }

        const directRate = await this.getPair(this.baseCurrency, symbol);
        let percentageChanged;

        if (directRate.rate != undefined) {
          // Get direct rate
          medianRate = bn(directRate.rate).mul(bn(10 ** decimals)).toString();
          percentageChanged = await this.checkPercentageChanged(symbol, medianRate);

        } else {
          // Get indirect rate
          const indirectRate = await this.getIndirectRate(symbol);
          medianRate = bn(indirectRate).mul(bn(10 ** decimals)).toString();
          percentageChanged = await this.checkPercentageChanged(symbol, medianRate);
          logger.info(percentageChanged);
        }

        if (medianRate > 0) {
          if (percentageChanged || this.force) {
            const symbolMedianRate = {
              symbol: symbol,
              oracle: address,
              rate: medianRate
            };

            this.ratesToProvide.push(symbolMedianRate);
          }
        }
      } catch (e) {
        logger.warn(`Error loading rate for ${symbol} - ${e.message}`);
      }
    }

    // FIXME: It's using the provider state to store the ratesToProvide
    // but it also returns the list when called, mixed approach should be avoided
    // and replace with a pure functional paradigm
    return this.ratesToProvide;
  }

  async persistRates(ratesToProvide) {
    for (var currency of ratesToProvide) {
      const pair = this.baseCurrency + '/' + currency.symbol;
      await storage.setItem(pair, currency.rate);
    }
  }

  async checkPercentageChanged(symbol, newRate) {
    let abruptRateChanged = false;

    const pair = this.baseCurrency + '/' + symbol;
    const pr = await storage.getItem(pair);

    if (pr) {
      let percentageChanged;
      if (pr >= newRate) {
        percentageChanged = (1 - (newRate / pr)) * 100;
      } else {
        percentageChanged = ((newRate / pr) - 1) * 100;
      }
      logger.info('Percentage Changed', percentageChanged.toString());

      const absPc = Math.abs(percentageChanged);
      if (absPc > this.options.percentageThreshold) {
        // Update rate, add to send in tx
        abruptRateChanged = true;
      }
    } else {
      logger.info(`Prev rate for ${symbol} input not found`);
      return true;
    }

    logger.info(abruptRateChanged);
    return abruptRateChanged;
  }

  buildProvideTx(rates) {
    if (rates.length === 1) {
      return this.oracleFactory.methods.provide(
        rates[0].oracle,
        rates[0].rate
      );
    } else {
      return this.oracleFactory.methods.provideMultiple(
        rates.map(r => r.oracle),
        rates.map(r => r.rate)
      );
    }
  }

  async sendProvideTx(rates, from) {
    if (rates.length === 0) {
      logger.info('No rates to provide');
    }

    const tx = this.buildProvideTx(rates);
    // Add 10% to the estimated gas limit
    const gasLimit = bn(await tx.estimateGas({ from: from.address })).mul(bn(110)).div(bn(100));
    // Add 2.01% to the estimated gas price
    const gasPrice = bn(await this.w3.eth.getGasPrice()).mul(bn(10201)).div(bn(10000));
    return tx.send({ from: from.address, gas: gasLimit, gasPrice: gasPrice });
  }

  async provideRates(signer, force = false) {
    // Reset provider internal state
    // FIXME: If those state variables are always reseted when provideRates is called
    // they shouldn't be stored on object scope
    this.ratesProvided = [];
    this.ratesToProvide = [];
    this.force = force;

    // Load market rates into the provider internal state
    // FIXME: avoid using provider internal state, take function approach
    await this.getMarketsRates();
    this.logMarketMedianRates();

    // Calculate Oracle rates for all requested pairs
    const oraclesRatesData = await this.getOraclesRatesData();
    if (oraclesRatesData.length > 0) {
      try {
        const tx = await this.sendProvideTx(oraclesRatesData, signer);
        this.logRates(this.ratesToProvide, signer);
        await this.persistRates(this.ratesToProvide);
        logger.info('txHash: ' + tx.transactionHash);

        return true;
      } catch (e) {
        logger.warn(`Error providing rates ${e.message}`);
      }
    } else {
      logger.info('No rates to provide or No rates changed > 1 %');
    }

    return false;
  }
};
