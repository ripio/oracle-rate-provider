const Market = require('./Market.js');
const ccxt = require ('ccxt');

module.exports = class Upbit extends Market {
  constructor(w3, exchangeId) {
    super(w3);

    this.market  = new ccxt[exchangeId];
  }

  async getRate(currency_from, currency_to) {
    const pair = await this.market.fetchTicker(currency_from + '/' + currency_to);

    let rate;
    if (currency_to == 'USD' || currency_to == 'ARS'){
      rate = this.toEquivalent(pair.last, 2);
      
    } else {
      rate = this.toEquivalent(pair.last, 18);
    }
    return rate;
  }
};
