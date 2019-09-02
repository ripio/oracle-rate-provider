const ropstenContracts = require('./ropstenContracts.js');

const oracleCurrency = 'RCN';
const oracles = ['ETH', 'BTC', 'USD', 'ARS'];
const reutersUrl = 'https://www.reuters.com/assets/';

const signersData = [
  {
    currency_from: 'RCN',
    currency_to: 'ETH',
    exchangesIds: ['binance', 'uniswap', 'huobipro', 'hitbtc']
  },
  {
    currency_from: 'RCN',
    currency_to: 'BTC',
    exchangesIds: ['binance', 'huobipro', 'bittrex', 'upbit', 'hitbtc']
  },
  {
    currency_from: 'BTC',
    currency_to: 'USD',
    exchangesIds: ['bittrex', 'kraken', 'gemini']
  },
  {
    currency_from: 'USD',
    currency_to: 'ARS',
    exchangesIds: ['reuters']
  }
];

module.exports = {
  node: ropstenContracts.nodes.infura,
  RCN: ropstenContracts.RCNToken,
  oracleFactory: ropstenContracts.oracleFactory,
  oracle: ropstenContracts.oracle,
  signersData: signersData,
  markets: ropstenContracts.markets,
  oracleCurrency: oracleCurrency,
  oracles: oracles,
  reutersUrl: reutersUrl
};
