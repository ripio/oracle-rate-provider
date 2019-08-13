const MarketsManager = require('./MarketsManager.js');

module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
    this.MarketsManager = null;
  }

  async init() {
    this.MarketsManager = await new MarketsManager(this.w3).init();
    return this;
  }

  async provideRates(signer) {
    for (let data of signer.data) {

      if(!this.oracles[data.currency]){
        console.log('Wrong currency: ' + data.currency);
        continue;
      }

      const rate = await this.MarketsManager.getRate(data);
      if(!rate){
        console.log('Wrong rate: ' + rate);
        continue;
      }

      const address = this.oracles[data.currency]._address;
      if (!address) {
        console.log('Wrong address: ' + address);
        continue;
      }

      console.log('Starting send transaction with marmo');

      const gasPrice = await this.w3.eth.getGasPrice();
      //console.log('GasPrice: ', gasPrice);
      const gasEstimate = await this.oracleFactory.methods.provide(address, rate).estimateGas(
        { from: signer.address }
      );
      //console.log('GasEstimate: ', gasEstimate);

      const log = 'Provide(signer: ' + signer.address + ', rate: ' + rate + ')';

      try {
        const tx = await this.oracleFactory.methods.provide(address, rate).send(
          { from: signer.address, gas: gasEstimate, gasPrice: gasPrice }
        );
        console.log(log + ', txHash: ' + tx.transactionHash);
      } catch(e) {
        console.log('Error: ' + log + ' Error message: ' + e.message);
      }
    }
  }
};
