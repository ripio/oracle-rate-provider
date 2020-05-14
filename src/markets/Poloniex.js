const Market = require('./Market.js');
const ccxt = require ('ccxt');

module.exports = class Poloniex extends Market {
  constructor(w3, exchangeId) {
    super(w3);

    this.market  = new ccxt[exchangeId];
  }


  async getRate(currency_from, currency_to, decimals) {

    const curreny_to_target = currency_to == 'USD' ? 'USDT' : currency_to;

    const pair = await this.market.fetchTicker(currency_from + '/' + curreny_to_target);

    const rate = this.toEquivalent(pair.last, decimals);
    return rate;
  }

};
