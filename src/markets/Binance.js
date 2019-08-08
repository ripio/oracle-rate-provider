const Market = require('./Market.js');
const ccxt = require ('ccxt');

module.exports = class Binanace extends Market {
  constructor(w3, exchangeId) {
    super(w3);

    this.market  = new ccxt[exchangeId];
  }

  bn (number) {
    return new this.w3.utils.BN(number);
  }

  async getRate(currency) {
    const pair = await this.market.fetchTicker('RCN/' + currency);
    return pair.info.lastPrice;
  }
};
