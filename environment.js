const ropstenContracts = require('./ropstenContracts.js');

const signersData = [
  {
    currency_from: 'RCN',
    currency_to: 'ETH',
    exchangesIds: ['binance'],
    type: 'direct' 
  },
  {
    currency_from: 'RCN',
    currency_to: 'BTC',
    exchangesIds: ['binance'],
    type: 'direct'
  },
  {
    currency_from: 'BTC',
    currency_to: 'USDT',
    exchangesIds: ['binance'],
    type: 'direct'
  },
  {
    currency_from: 'RCN',
    currency_to: 'USDT',
    exchangesIds: [],
    type: 'indirect'
  }
];

module.exports = {
  node: ropstenContracts.nodes.infura,
  RCN: ropstenContracts.RCNToken,
  oracleFactory: ropstenContracts.oracleFactory,
  oracle: ropstenContracts.oracle,
  signersData: signersData,
  markets: ropstenContracts.markets
};
