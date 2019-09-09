const MarketsManager = require('./MarketsManager.js');


module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
    this.MarketsManager = null;
  }

  bn (number) {
    return this.w3.utils.toBN(number);
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

      median =  (num1.add(num2)).div(this.bn(2)).toString();

    } else { 
      median = rates[(rateLen - 1) / 2];
    }

    return median;
  }

  async provideRates(signer) {

    let data = signer.data;

    for (var currencydata of data) {

      if (!this.oracles[currencydata.currency]) {
        console.log('Wrong currency: ' + currencydata.currency);
      }

      const marketManager = this.MarketsManager;

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

      const address = this.oracles[currencydata.currency]._address;
      if (!address) {
        console.log('Wrong address: ' + address);
      }

      console.log('Starting send transaction with marmo');
      console.log('currency: ' + currencydata.currency + ' , median rate: ' + medianRate);


      const gasPrice = await this.w3.eth.getGasPrice();
      const gasEstimate = await this.oracleFactory.methods.provide(address, medianRate).estimateGas(
        { from: signer.address }
      );

      // 10% more than gas estimate 
      const moreGasEstimate = (gasEstimate * 1.1).toFixed(0);
      const log = 'Provide(signer: ' + signer.address + ', rate: ' + medianRate + ')';

      try {
        const tx = await this.oracleFactory.methods.provide(address, medianRate).send(
          { from: signer.address, gas: moreGasEstimate, gasPrice: gasPrice }
        );
        console.log(log + ', txHash: ' + tx.transactionHash);
      } catch (e) {
        console.log('Error: ' + log + ' Error message: ' + e.message);
      }
    }
  }
};
