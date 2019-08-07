const W3 = require('web3');

const env = require('../environment.js');

module.exports.w3 = new W3(new W3.providers.HttpProvider(env.node));

module.exports.instanceOracleFactory = async () => {
  return new this.w3.eth.Contract(env.oracleFactory.abi, env.oracleFactory.address);
};

module.exports.instanceOracles = async (oracleFactory) => {
  const oracles = [];

  const symbols = new Set(
    env.signersData
      .reduce((prev, x) => prev.concat(x))
      .map(x => x.currency)
  );

  for (const symbol of symbols) {
    const oracleAddr = await oracleFactory.methods.symbolToOracle(symbol).call();
    if (oracleAddr === '0x0000000000000000000000000000000000000000') {
      console.log('The oracle of \'' + symbol + '\' dont exists');
    } else {
      const oracle = new this.w3.eth.Contract(env.oracle.abi, oracleAddr);
      oracles[symbol] = oracle;
      console.log('Oracle: ' + symbol + ', Address: ' + oracleAddr);
    }
  }

  return oracles;
};

module.exports.instanceSigners = async (pks) => {
  if (!(pks && pks.length)) throw new Error('There are no private keys to instance the signers: ' + pks);

  if (pks.length !== env.signersData.length) throw new Error(
    'The length of the signersData must be equal than the pks: \n' +
    '\t' + pks.length + ' pks length\n' +
    '\t' + env.signersData.length + ' env.signersData length'
  );

  const signers = [];
  for (let i = 0; i < pks.length; i++) {
    const pk = pks[i];

    if(this.w3.utils.isHexStrict(pk)) {
      const signer = this.w3.eth.accounts.privateKeyToAccount(pk);
      this.w3.eth.accounts.wallet.add(signer);
      signer.data = env.signersData[i];
      signers.push(signer);
    } else {
      console.log('The private key its not valid: ' + pk);
    }
  }

  console.log('All signers: \n\t' + signers.map(x => x.address).join('\n\t'));

  return signers;
};
