const Web3 = require('web3');

const BN = Web3.utils.BN;

module.exports = (value) => {
  return new BN(value);
};
