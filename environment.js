const ropstenContracts = require('./ropstenContracts.js');
const mainnetContracts = require('./mainnetContracts.js');

const primaryCurrency = 'RCN';
const primaryCurrencyTest = 'TEST';
const oracles = ['ETH', 'BTC', 'USD', 'ARS','DAI','MANA'];
const oraclesTest = ['ETH'];
const reutersUrl = 'https://www.reuters.com/assets/';
const percentageChange = 1;

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
    exchangesIds: ['binance', 'huobipro', 'upbit'],
    decimals: 18
  }
];

const signersDataTest = [
  {
    currency_from: 'TEST',
    currency_to: 'ETH',
    exchangesIds: ['uniswap'],
    decimals: 18
  },
  {
    currency_from: 'TEST',
    currency_to: 'DEST',
    exchangesIds: ['uniswap'],
    decimals: 18
  },
];

module.exports.main = {
  node: mainnetContracts.nodes.infura,
  RCN: mainnetContracts.RCNToken,
  oracleFactory: mainnetContracts.oracleFactory,
  oracle: mainnetContracts.oracle,
  markets: ropstenContracts.markets,
  primaryCurrency: primaryCurrency,
  oracles: oracles,
  signersData: signersData,
  reutersUrl: reutersUrl,
  percentageChange: percentageChange
};

module.exports.ropsten = {
  node: ropstenContracts.nodes.infura,
  RCN: ropstenContracts.RCNToken,
  oracleFactory: ropstenContracts.oracleFactory,
  oracle: ropstenContracts.oracle,
  markets: ropstenContracts.markets,
  primaryCurrency: primaryCurrencyTest,
  oracles: oraclesTest,
  signersData: signersDataTest,
  percentageChange: percentageChange,
  destToken: ropstenContracts.DESTToken,
  reutersUrl: reutersUrl 
};
