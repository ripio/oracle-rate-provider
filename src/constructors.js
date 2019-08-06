const W3 = require('web3');

const env = require('../environment.js');

module.exports.w3 = new W3(new W3.providers.HttpProvider(env.node));

module.exports.instanceSigners = async (listSeeds) => {
  for (const seed of listSeeds) {
    let signer;

    if(this.w3.utils.isHexStrict(seed)) {
      signer = this.w3.eth.accounts.privateKeyToAccount(seed);
    } else {
      signer = this.w3.eth.accounts.create(seed);
    }

    this.w3.eth.accounts.wallet.add(signer);
  }
};

module.exports.instanceOracleFactory = async () => {
  return new this.w3.eth.Contract(env.oracleFactory.abi, env.oracleFactory.address);
};

module.exports.instanceOracles = async (oracleFactory) => {
  const signers = this.w3.eth.accounts.wallet;
  const oracles = [];

  for (const symbol of env.oracle.symbols) {
    const oracleAddr = await oracleFactory.methods.symbolToOracle(symbol).call();
    const oracle = new this.w3.eth.Contract(env.oracle.abi, oracleAddr);
    oracle.signers = [];

    for (let i = 0; i < signers.length; i++)
      if (await oracle.methods.isSigner(signers[i].address).call())
        oracle.signers.push(signers[i]);

    oracles.push(oracle);

    console.log('Oracle: ' + symbol + ', Address: ' + oracleAddr);
    console.log('Signers: \n\t' + oracle.signers.map(x => x.address).join('\n\t'));
  }

  return oracles;
};
