const Rate = require('./rate.js');

const env = require('../environment.js');

module.exports = class Provider {
  constructor(w3, oracleFactory) {
    this.w3 = w3;
    this.oracleFactory = oracleFactory;
  }

  async provideRate(oracle, signer) {
    const rate = await Rate.get(env.exchangeIds[signer.index]);

    if(!rate){
      console.log('Wrong rate: ' + rate.toString());
      return;
    }

    const gasPrice = await this.w3.eth.getGasPrice();
    const gasEstimate = await this.oracleFactory.methods.provide(oracle.options.address, rate.toString()).estimateGas(
      { from: signer.address }
    );
    const log = 'Provide(signer: ' + signer.address + ', rate: ' + rate + ')';

    try {
      const tx = await this.oracleFactory.methods.provide(oracle.options.address, rate).send(
        { from: signer.address, gas: gasEstimate, gasPrice: gasPrice }
      );
      console.log(log + ', txHash: ' + tx.transactionHash);
    } catch(e) {
      console.log('Error: ' + log + ' Error message: ' + e.message);
    }
  }
};
