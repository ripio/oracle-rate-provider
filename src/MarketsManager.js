const Binance = require('./markets/Binance.js');
const Uniswap = require('./markets/Uniswap.js');

module.exports = class MarketsManager {
  constructor(w3) {
    this.w3 = w3;

    this.markets = [];
  }

  async init() {
    this.markets['binance'] = new Binance(this.w3, 'binance');
    this.markets['uniswap'] = await new Uniswap(this.w3).init();
    // TODO
    //markets['bitfinex'] = new Bitfinex(w3, 'bitfinex');
    //markets['gateio'] = new Gateio(w3, 'gateio');
    //markets['huobipro'] = new Huobipro(w3, 'huobipro');
    //markets['huobiru'] = new Huobiru(w3, 'huobiru');
    //markets['kyber'] = new Kyber(w3, 'kyber');

    return this;
  }

  bn (number) {
    return new this.w3.utils.BN(number);
  }

  async getRate(data) {
    let rate;
    try {
      rate = await this.markets[data.exchangeId].getRate(data.currency);
    } catch(e) {
      console.log('Error message: ' + e.message);
    }

    return rate;
  }
};

/*
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


async function kyber(exchangeId) {
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.last_price;
}

async function uniswap(exchangeId) {
  // TODO
  const pair = await ccxtGetPair(exchangeId);
  return pair.info.last_price;
}*/
