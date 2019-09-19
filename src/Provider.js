const MarketsManager = require('./MarketsManager.js');
const env = require('../environment.js');
const storage = require('node-persist');


module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.netEnv = process.env.NETWORK == 'mainnet' ? env.main : env.ropsten;
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
    this.MarketsManager = null;
    this.ratesProvided = [];
    this.ratesToProvide = [];
    this.provideAll = false;
  }

  bn(number) {
    return this.w3.utils.toBN(number);
  }

  toUint96(number) {
    const hex = number.toString(16);
    return `0x${'0'.repeat(24 - hex.length)}${hex}`;
  }

  logRates(providedData, signer) {
    for (var currencyData of providedData) {
      const log = 'Provide(signer: ' + signer.address + ',  oracle: ' + currencyData.oracle + ',  rate: ' + currencyData.rate + ')';
      console.log(log);
    }
  }

  logRatesToProvide() {
    console.log('\n');
    for (var provideRate of this.ratesToProvide) {
      const log = 'Providing Median Rate for ' + this.netEnv.primaryCurrency + '/' + provideRate.symbol + ': ' + provideRate.rate;
      console.log(log);
    }
  }

  logMarketMedianRates() {
    for (var currencyData of this.ratesProvided) {
      const log = 'Median Rate ' + currencyData.currency_from + '/' + currencyData.currency_to + ': ' + currencyData.rate + ' from markets: ' + currencyData.markets;
      console.log(log);
    }
  }

  async init() {
    this.MarketsManager = await new MarketsManager(this.w3).init();
    return this;
  }

  async getMedian(rates) {
    var median = 0, rateLen = rates.length;

    if (!rateLen)
      return undefined;

    rates.sort();

    if (rateLen % 2 === 0) {
      const num1 = this.bn(rates[this.bn(rateLen).div(this.bn(2)) - 1]);
      const num2 = this.bn(rates[this.bn(rateLen).div(this.bn(2))]);

      median = (num1.add(num2)).div(this.bn(2)).toString();
    } else {
      median = rates[(rateLen - 1) / 2];
    }

    return median;
  }

  async getMedianFromMarkets(currencydata) {

    console.log('Getting ' + currencydata.currency_from + '/' + currencydata.currency_to + ' rates...');

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
      if (rate) {
        rates.push(rate);
      } else {
        console.log('Wrong rate: ' + rate);
      }
    }
    let medianRate;
    if (rates.length > 0) {
      medianRate = await this.getMedian(rates);
      if (!medianRate) {
        console.log('Dont have rates');
        return;
      }
    } else {
      medianRate = 0;
    }

    console.log('Median Rate ' + currencydata.currency_from + '/' + currencydata.currency_to + ': ' + medianRate + '\n');

    const rateProvided = {
      currency_from: currencydata.currency_from,
      currency_to: currencydata.currency_to,
      rate: medianRate,
      markets: currencydata.exchangesIds,
      decimals: currencydata.decimals
    };

    this.ratesProvided.push(rateProvided);
  }

  async getMarketsRates(data) {

    console.log('Gathering Market data...');

    for (var pair of data) {
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
    const pairsToPrimary = await this.getPairsTo(this.primaryCurrency);
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
      const ratePrimary = await this.getPair(this.primaryCurrency, matchSymbol);
      const rateSymbol = await this.getPair(matchSymbol, symbol);
      let medianRate;

      if (!matchPairTo) {
        medianRate = this.bn(ratePrimary.rate).mul(this.bn(rateSymbol.rate)).div(this.bn(10 ** rateSymbol.decimals)).toString();
      } else {
        if (rateSymbol.rate != 0) {
          medianRate = this.bn(ratePrimary.rate).mul(this.bn(10 ** rateSymbol.decimals)).div(this.bn(rateSymbol.rate)).toString();
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
            const primaryRate = await this.getPair(this.primaryCurrency, cp);
            const symbolRate = await this.getPair(cs, symbol);
            const intermidateRate = pair.rate;

            const medianRate = this.bn(primaryRate.rate).mul(this.bn(symbolRate.rate)).mul(this.bn(intermidateRate)).toString();
            const medianRateDecimals = this.bn(medianRate).div(this.bn(10 ** symbolRate.decimals)).div(this.bn(10 ** pair.decimals)).toString();
            return medianRateDecimals;
          }
        }
      }
    }

    const err = '';
    return err;
  }


  async getOraclesRatesData() {
    let ratesProvidedData = [];

    for (var symbol of this.oracleSymbols) {
      let medianRate;

      // Check currency
      if (!this.oracles[symbol]) {
        console.log('Wrong currency: ' + symbol);
      }
      // Check address
      const address = this.oracles[symbol]._address;
      if (!address) {
        console.log('Wrong address: ' + address);
      }
      // Check decimals
      const decimals = await this.oracles[symbol].methods.decimals().call();
      if (!decimals) {
        console.log('Wrong decimals: ' + decimals);
      }

      const directRate = await this.getPair(this.primaryCurrency, symbol);
      let percentageChanged;

      if (directRate.rate != undefined) {
        // Get direct rate
        medianRate = this.bn(directRate.rate).mul(this.bn(10 ** decimals)).toString();
        percentageChanged = await this.checkPercentageChanged(symbol, medianRate);

      } else {
        // Get indirect rate
        const indirectRate = await this.getIndirectRate(symbol);
        medianRate = this.bn(indirectRate).mul(this.bn(10 ** decimals)).toString();
        percentageChanged = await this.checkPercentageChanged(symbol, medianRate);
      }
      if (medianRate > 0) {
        if (this.provideAll || percentageChanged) {
          const symbolMedianRate = {
            symbol: symbol,
            oracle: address,
            rate: medianRate
          };

          this.ratesToProvide.push(symbolMedianRate);
        }
      }
    }
    return this.ratesToProvide;
  }


  async persistRates(ratesToProvide) {
    for (var currency of ratesToProvide) {
      const pair = this.netEnv.primaryCurrency + '/' + currency.symbol;
      await storage.setItem(pair, currency.rate);
    }
  }

  async checkPercentageChanged(symbol, newRate) {
    let abruptRateChanged = false;

    const pair = this.netEnv.primaryCurrency + '/' + symbol;
    const pr = await storage.getItem(pair);
    console.log('pair', pair);

    if (pr) {
      let percentageChanged;
      if (pr >= newRate) {
        percentageChanged = (1 - (newRate / pr)) * 100;
      } else {
        percentageChanged = ((newRate / pr) - 1) * 100;
      }
      console.log('Percentage Changed', percentageChanged.toString());

      const absPc = Math.abs(percentageChanged);
      if (absPc > this.netEnv.percentageChange) {
        // Update rate, add to send in tx
        abruptRateChanged = true;
      }
    }
    console.log(abruptRateChanged);
    return abruptRateChanged;
  }


  async provideRates(signer, pc, oraclesSymbols, provideAll) {
    this.oracleSymbols = oraclesSymbols;
    this.primaryCurrency = pc;
    this.ratesProvided = [];
    this.ratesToProvide = [];
    this.provideAll = provideAll;
    let provideOneOracle;
    let provideOneRate;
    let gasEstimate;
    let oracles = [];
    let rates = [];

    await this.getMarketsRates(signer.data);
    this.logMarketMedianRates();

    const oraclesRatesData = await this.getOraclesRatesData();
    this.logRatesToProvide();

    if (oraclesRatesData.length > 0) {
      const gasPrice = await this.w3.eth.getGasPrice();
      if (oraclesRatesData.length == 1) {
        provideOneOracle = this.ratesToProvide[0].oracle;
        provideOneRate = this.ratesToProvide[0].rate;
        gasEstimate = await this.oracleFactory.methods.provide(provideOneOracle, provideOneRate).estimateGas(
          { from: signer.address }
        );
      } else {
        for (var c of oraclesRatesData) {
          oracles.push(c.oracle);
          rates.push(c.rate);
        }
        gasEstimate = await this.oracleFactory.methods.provideMultiple(oracles, rates).estimateGas(
          { from: signer.address }
        );
      }

      // 10% more than gas estimate
      const moreGasEstimate = (gasEstimate * 1.1).toFixed(0);

      console.log('Starting send transaction with marmo...');

      try {
        let tx;
        if (oraclesRatesData.length == 1) {
          tx = await this.oracleFactory.methods.provide(provideOneOracle, provideOneRate).send(
            { from: signer.address, gas: moreGasEstimate, gasPrice: gasPrice }
          );
        } else {
          tx = await this.oracleFactory.methods.provideMultiple(oracles, rates).send(
            { from: signer.address, gas: moreGasEstimate, gasPrice: gasPrice }
          );
        }

        this.logRates(this.ratesToProvide, signer);

        await this.persistRates(this.ratesToProvide);

        console.log('txHash: ' + tx.transactionHash);
      } catch (e) {
        console.log(' Error message: ' + e.message);
      }

    } else {
      console.log('No rates to provide or No rates changed > 1 %');
    }
  }
};
