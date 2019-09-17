const W3 = require('web3');

const env = require('../environment.js');

const netEnv = process.env.NETWORK == 'mainnet' ? env.main : env.ropsten;

module.exports.w3 = new W3(new W3.providers.HttpProvider(netEnv.node));


module.exports.instanceOracleFactory = async () => {
  return new this.w3.eth.Contract(netEnv.oracleFactory.abi, netEnv.oracleFactory.address);
};

module.exports.instanceOracles = async (oracleFactory) => {
  const oracles = [];

  const symbols = netEnv.oracles;

  console.log('All oracles:');
  for (const symbol of symbols) {

    const oracleAddr = await oracleFactory.methods.symbolToOracle(symbol).call();
    if (oracleAddr === '0x0000000000000000000000000000000000000000') {
      console.log('\tCurrency: ' + symbol + ', the oracle dont exists');
    } else {
      const oracle = new this.w3.eth.Contract(netEnv.oracle.abi, oracleAddr);
      oracles[symbol] = oracle;
      console.log('\tCurrency: ' + symbol + ', Address: ' + oracleAddr);
    }
  }

  return oracles;
};

module.exports.instanceSigners = async (pk) => {
  if (!(pk)) throw new Error('There are no private keys to instance the signers: ' + pk);

  let signer;
  if (this.w3.utils.isHexStrict(pk)) {
    signer = this.w3.eth.accounts.privateKeyToAccount(pk);
    this.w3.eth.accounts.wallet.add(signer);
    signer.data = netEnv.signersData;
  } else {
    console.log('The private key its not valid: ' + pk);
  }

  return signer;
};
