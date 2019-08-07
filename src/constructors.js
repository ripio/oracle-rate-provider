const W3 = require('web3');

const env = require('../environment.js');

module.exports.w3 = new W3(new W3.providers.HttpProvider(env.node));

module.exports.instanceSigners = async (pks) => {
  if (!(pks && pks.length)) throw new Error('There are no private keys to instance the signers');

  for (const pk of pks) {
    if(this.w3.utils.isHexStrict(pk)) {
      const signer = this.w3.eth.accounts.privateKeyToAccount(pk);
      this.w3.eth.accounts.wallet.add(signer);
    } else {
      console.log('The private key its not valid: ' + pk);
    }
  }

  const wallets = [];
  for (let i = 0; i < this.w3.eth.accounts.wallet.length; i++)
    wallets.push(this.w3.eth.accounts.wallet[i].address);
  console.log('All signers: \n\t' + wallets.join('\n\t'));
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
    if(oracle.signers && oracle.signers.length)
      console.log('Signers: \n\t' + oracle.signers.map(x => x.address).join('\n\t'));
    else
      console.log('\tThe oracle dont have signers');
  }

  return oracles;
};
