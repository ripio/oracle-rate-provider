const ropstenContracts = require('./ropstenContracts.js');

const signersData = [
  {
    currency_from: 'RCN',
    currency_to: 'ETH',
    exchangesIds: ['binance', 'uniswap', 'huobipro', 'hitbtc'],
    type: 'direct' 
  },
  {
    currency_from: 'RCN',
    currency_to: 'BTC',
    exchangesIds: ['binance', 'huobipro', 'bittrex', 'upbit', 'hitbtc'],
    type: 'direct'
  },
  {
    currency_from: 'RCN',
    currency_to: 'USD',
    exchangesIds: ['binance'],
    type: 'indirect'
  },
  {
    currency_from: 'BTC',
    currency_to: 'USD',
    exchangesIds: ['bittrex', 'kraken', 'gemini'],
    type: 'direct'
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
