const ccxt = require ('ccxt');
const W3 = require('web3');

const env = require('../environment.js');

const w3 = new W3(new W3.providers.HttpProvider(env.node));

function bn (number) {
  return new w3.utils.BN(number);
}

async function ccxtGetPair(exchangeId) {
  const market  = new ccxt[exchangeId];
  return await market.fetchTicker('RCN/ETH');
}

async function bitfinex(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.last_price;
}

async function gateio(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.last;
}

async function huobipro(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.close;
}

async function huobiru(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.close;
}

async function binance(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.lastPrice;
}

async function kyber(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.last_price;
}

async function uniswap(exchangeId) {
  // TODO
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.last_price;
}

const markets = {
  bitfinex: bitfinex,
  gateio: gateio,
  huobipro: huobipro,
  huobiru: huobiru,
  binance: binance,
  kyber: kyber,
  uniswap: uniswap
};

module.exports.get = async (exchangeId) => {
  let rate;
  try {
    rate = await markets[exchangeId](exchangeId);
  } catch(e) {
    console.log('Error message: ' + e.message);
  }

  return bn(rate * 10 ** 18).toString();
};
