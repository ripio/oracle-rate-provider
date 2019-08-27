const MarketsManager = require('./MarketsManager.js');


module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
    this.MarketsManager = null;
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


  async getMarketsRates(data) {
    const marketManager = this.MarketsManager;

    let medianRates = [];

    for (var currencydata of data) {

      // Check currency
      if (!this.oracles[currencydata.currency]) {
        console.log('Wrong currency: ' + currencydata.currency);
      }
      // Check address
      const address = this.oracles[currencydata.currency]._address;
      if (!address) {
        console.log('Wrong address: ' + address);
      }

      let rates = [];

      for (var exchange of currencydata.exchangesIds) {
        const rateData = {
          currency: currencydata.currency,
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

      const providedData = {
        oracle: address,
        rate: medianRate
      };

      medianRates.push(providedData);
    }

    return medianRates;
  }

  async getMultipleProvideData(providedData) {
    let ratesProvided = [];

    for (var currencyData of providedData) {
      const rateProvided = `${this.toUint96(currencyData.rate)}${currencyData.oracle.replace('0x', '')}`;
      ratesProvided.push(rateProvided);
    }

    return ratesProvided;
  }

  async provideRates(signer) {

    const providedData = await this.getMarketsRates(signer.data);
    console.log('providedData', providedData);
    const multipleProvideData = await this.getMultipleProvideData(providedData);

    const gasPrice = await this.w3.eth.getGasPrice();
    const gasEstimate = await this.oracleFactory.methods.provideMultiple(multipleProvideData).estimateGas(
      { from: signer.address }
    );

    // 10% more than gas estimate 
    const moreGasEstimate = (gasEstimate * 1.1).toFixed(0);

    console.log('Starting send transaction with marmo');

    try {
      const tx = await this.oracleFactory.methods.provideMultiple(multipleProvideData).send(
        { from: signer.address, gas: moreGasEstimate, gasPrice: gasPrice }
      );
      
      console.log('tx success');
      this.logRates(providedData, signer);  

      console.log('txHash: ' + tx.transactionHash);
    } catch (e) {
      console.log(' Error message: ' + e.message);
    }
  }
};