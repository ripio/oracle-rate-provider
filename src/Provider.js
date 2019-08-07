const Rate = require('./rate.js');

module.exports = class Provider {
  constructor(w3, oracleFactory, oracles) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
    this.oracles = oracles;
  }

  async provideRates(signer) {
    for (let data of signer.data) {
      const rate = await Rate.get(data);
      if(!rate){
        console.log('Wrong rate: ' + rate.toString());
        return;
      }

      const gasPrice = await this.w3.eth.getGasPrice();
      const gasEstimate = await this.oracleFactory.methods.provide(this.oracles[data.currency]._address, rate.toString()).estimateGas(
        { from: signer.address }
      );
      const log = 'Provide(signer: ' + signer.address + ', rate: ' + rate + ')';

      try {
        const tx = await this.oracleFactory.methods.provide(this.oracles[data.currency]._address, rate).send(
          { from: signer.address, gas: gasEstimate, gasPrice: gasPrice }
        );
        console.log(log + ', txHash: ' + tx.transactionHash);
      } catch(e) {
        console.log('Error: ' + log + ' Error message: ' + e.message);
      }
    }
  }
};
