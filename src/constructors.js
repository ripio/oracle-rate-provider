const W3 = require('web3');

const env = require('../environment.js');


module.exports.getw3 = () => {
  const network = process.env.NETWORK;
  console.log(network);
  if (network == 'mainnet') {
    // TO DO - CHANGE TO MAINNET 
    return new W3(new W3.providers.HttpProvider(env.nodeRopsten));
  }
  if (network == 'ropsten') {
    return new W3(new W3.providers.HttpProvider(env.nodeRopsten));
  }
};

module.exports.w3 = this.getw3();


module.exports.instanceOracleFactory = async () => {
  const network = process.env.NETWORK;
  if (network == 'mainnet') {
    return new this.w3.eth.Contract(env.oracleFactory.abi, env.oracleFactory.address);
  }
  if (network == 'ropsten') {
    return new this.w3.eth.Contract(env.oracleFactoryTest.abi, env.oracleFactoryTest.address);
  }
};

module.exports.instanceOracles = async (oracleFactory) => {
  const oracles = [];

  const symbols = process.env.NETWORK == 'mainnet' ? env.oracles : env.oraclesTest;

  console.log('All oracles:');
  for (const symbol of symbols) {

    const oracleAddr = await oracleFactory.methods.symbolToOracle(symbol).call();
    if (oracleAddr === '0x0000000000000000000000000000000000000000') {
      console.log('\tCurrency: ' + symbol + ', the oracle dont exists');
    } else {
      const oracle = new this.w3.eth.Contract(env.oracle.abi, oracleAddr);
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
    signer.data = process.env.NETWORK == 'mainnet' ? env.signersData : env.signersDataTest;
  } else {
    console.log('The private key its not valid: ' + pk);
  }

  return signer;
};
