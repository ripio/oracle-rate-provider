const MarketsManager = require('./MarketsManager.js');
const env = require('../environment.js');

module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
    this.MarketsManager = null;
    this.ratesProvided = [];
    this.oracleSymbols = env.oracles;
    this.primaryCurrency = env.primaryCurrency;
    this.ratesToProvide = [];
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
      const log = 'Providing Median Rate for ' + this.primaryCurrency + '/' + provideRate.symbol + ': ' + provideRate.rate;
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
    rates.sort();

    if (
      rateLen % 2 === 0
    ) {
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
    const medianRate = await this.getMedian(rates);

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

    const getIntersection = await this.getIntersection(pairsToPrimary, pairsFromSymbol);

    if (getIntersection.length > 0) {
      const matchSymbol = getIntersection[0];
      const ratePrimary = await this.getPair(this.primaryCurrency, matchSymbol);
      const rateSymbol = await this.getPair(matchSymbol, symbol);

      const medianRate = this.bn(ratePrimary.rate).mul(this.bn(rateSymbol.rate)).div(this.bn(10 ** rateSymbol.decimals)).toString();
      return medianRate;
    } else {
      for (var cp of pairsToPrimary) {
        for (var cs of pairsFromSymbol) {
          const pair = await this.getPair(cp,cs);
          if (pair.rate != undefined) {
            const primaryRate = await this.getPair(this.primaryCurrency, cp);
            const symbolRate = await this.getPair(cs, symbol);
            const intermidateRate = pair.rate;

            const medianRate = this.bn(primaryRate.rate).mul(this.bn(symbolRate.rate)).mul(this.bn(intermidateRate)).toString();
            const medianRateDecimals = this.bn(medianRate).div(this.bn(10 ** symbolRate.decimals)).div(this.bn(10 ** pair.decimals));
            return medianRateDecimals;
          }
        }
      }
    }

    const err = 'Cannot get median Rate: '+ this.primaryCurrency + '/' + symbol;
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

      const directRate = await this.getPair(this.primaryCurrency, symbol);

      if (directRate.rate != undefined) {
        // Get direct rate
        medianRate = directRate.rate;

        const rateProvided = `${this.toUint96(Number(medianRate))}${address.replace('0x', '')}`;
        ratesProvidedData.push(rateProvided);
      } else {
        // Get indirect rate
        medianRate = await this.getIndirectRate(symbol);

        const rateProvided = `${this.toUint96(Number(medianRate))}${address.replace('0x', '')}`;
        ratesProvidedData.push(rateProvided);

      }

      const symbolMedianRate = {
        symbol: symbol,
        oracle: address,
        rate: medianRate
      };

      this.ratesToProvide.push(symbolMedianRate);  
    }

    return ratesProvidedData;
  }


  async provideRates(signer) {
    this.ratesProvided = [];

    await this.getMarketsRates(signer.data);
    this.logMarketMedianRates();

    const oraclesRatesData = await this.getOraclesRatesData();
    this.logRatesToProvide();


    // console.log('Data provided for transaction', oraclesRatesData);

    const gasPrice = await this.w3.eth.getGasPrice();
    const gasEstimate = await this.oracleFactory.methods.provideMultiple(oraclesRatesData).estimateGas(
      { from: signer.address }
    );

    // 10% more than gas estimate 
    const moreGasEstimate = (gasEstimate * 1.1).toFixed(0);

    console.log('Starting send transaction with marmo...');

    try {
      const tx = await this.oracleFactory.methods.provideMultiple(oraclesRatesData).send(
        { from: signer.address, gas: moreGasEstimate, gasPrice: gasPrice }
      );

      this.logRates(this.ratesToProvide, signer);

      console.log('txHash: ' + tx.transactionHash);
    } catch (e) {
      console.log(' Error message: ' + e.message);
    }
  }
};

