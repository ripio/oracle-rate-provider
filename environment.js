const ropstenContracts = require('./ropstenContracts.js');

const primaryCurrency = 'RCN';
const oracles = ['ETH', 'BTC', 'USD', 'ARS','DAI','MANA'];
const reutersUrl = 'https://www.reuters.com/assets/';

const signersData = [
  {
    currency_from: 'RCN',
    currency_to: 'ETH',
    exchangesIds: ['binance', 'uniswap', 'huobipro', 'hitbtc'],
    decimals: 18
  },
  {
    currency_from: 'RCN',
    currency_to: 'BTC',
    exchangesIds: ['binance', 'huobipro', 'bittrex', 'upbit', 'hitbtc'],
    decimals: 18
  },
  {
    currency_from: 'BTC',
    currency_to: 'USD',
    exchangesIds: ['bittrex', 'kraken', 'gemini'],
    decimals: 2
  },
  {
    currency_from: 'USD',
    currency_to: 'ARS',
    exchangesIds: ['reuters'],
    decimals: 2
  },
  {
    currency_from: 'BTC',
    currency_to: 'DAI',
    exchangesIds: ['hitbtc'],
    decimals: 2
  },
  {
    currency_from: 'MANA',
    currency_to: 'BTC',
    exchangesIds: ['binance'],
    decimals: 18
  }
];

module.exports = {
  node: ropstenContracts.nodes.infura,
  RCN: ropstenContracts.RCNToken,
  oracleFactory: ropstenContracts.oracleFactory,
  oracle: ropstenContracts.oracle,
  signersData: signersData,
  markets: ropstenContracts.markets,
  primaryCurrency: primaryCurrency,
  oracles: oracles,
  reutersUrl: reutersUrl
};
