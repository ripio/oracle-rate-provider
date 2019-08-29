const MarketsManager = require('./MarketsManager.js');


module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
    this.MarketsManager = null;
    this.ratesProvided = [];
    this.medianRates = [];
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

  logMarketMedianRates() {
    for (var currencyData of this.ratesProvided) {
      const log = ' Median Rate ' + currencyData.currency + ': ' + currencyData.rate + ' from markets: ' + currencyData.markets;
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
    const marketManager = this.MarketsManager;

    // Check currency
    if (!this.oracles[currencydata.currency_to]) {
      console.log('Wrong currency: ' + currencydata.currency);
    }
    // Check address
    const address = this.oracles[currencydata.currency_to]._address;
    if (!address) {
      console.log('Wrong address: ' + address);
    }

    let rates = [];

    // Get median from market rates 
    for (var exchange of currencydata.exchangesIds) {
      const rateData = {
        currency_from: currencydata.currency_from,
        currency_to: currencydata.currency_to,
        exchangeId: exchange
      };

      const rate = await marketManager.getRate(rateData);
      if (rate) {
        rates.push(rate);
      } else {
        console.log('Wrong rate: ' + rate);
      }
    }

    const medianRate = await this.getMedian(rates);

    this.ratesProvided.push({
      currency: currencydata.currency_to,
      rate: medianRate,
      markets: currencydata.exchangesIds
    });

    const providedData = {
      oracle: address,
      rate: medianRate
    };
    this.medianRates.push(providedData);
  }

  
  async getMarketsRates(data) {

    console.log('Gathering Market data...');

    for (var currencydata of data) {

      if (currencydata.direct) {
        await this.getMedianFromMarkets(currencydata);
      }
      else {
        // Get common currency values  
      }
    }
    return this.medianRates;
  }

  async getMultipleProvideData(providedData) {
    let ratesProvided = [];

    for (var currencyData of providedData) {
      const rateProvided = `${this.toUint96(Number(currencyData.rate))}${currencyData.oracle.replace('0x', '')}`;
      ratesProvided.push(rateProvided);
    }

    return ratesProvided;
  }

  async provideRates(signer) {
    this.ratesProvided = [];

    const providedData = await this.getMarketsRates(signer.data);
    this.logMarketMedianRates();
    const multipleProvideData = await this.getMultipleProvideData(providedData);

    const gasPrice = await this.w3.eth.getGasPrice();
    const gasEstimate = await this.oracleFactory.methods.provideMultiple(multipleProvideData).estimateGas(
      { from: signer.address }
    );

    // 10% more than gas estimate 
    const moreGasEstimate = (gasEstimate * 1.1).toFixed(0);

    console.log('Starting send transaction with marmo...');

    try {
      const tx = await this.oracleFactory.methods.provideMultiple(multipleProvideData).send(
        { from: signer.address, gas: moreGasEstimate, gasPrice: gasPrice }
      );

      this.logRates(providedData, signer);

      console.log('txHash: ' + tx.transactionHash);
    } catch (e) {
      console.log(' Error message: ' + e.message);
    }
  }
};