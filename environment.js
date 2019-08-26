const ropstenContracts = require('./ropstenContracts.js');

const signersData = [
  {
    currency: 'ETH',
    exchangesIds: ['binance', 'uniswap', 'huobipro', 'hitbtc']
  },
  {
    currency: 'BTC',
    exchangesIds: ['binance', 'huobipro', 'bittrex', 'upbit', 'hitbtc']
  }
];

module.exports = {
  node: ropstenContracts.nodes.infura,
  RCN: ropstenContracts.RCNToken,
  oracleFactory: ropstenContracts.oracleFactory,
  oracle: ropstenContracts.oracle,
  signersData: signersData,
  markets: ropstenContracts.markets,
  wait: process.env.WAIT * 60 * 1000 
};
