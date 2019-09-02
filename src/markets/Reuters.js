const Market = require('./Market.js');
const env = require('../../environment.js');
const axios = require('axios');

module.exports = class Reuters extends Market {

  constructor(w3) {
    super(w3);
  }

  async getRate(currency_from, currency_to, decimals) {

    const BASE_URL = env.reutersUrl;
    const queryCurrencies = 'jsonCurrencyConverter?' + 'srcCurr=' + currency_from + '&destCurr=' + currency_to;

    try {

      const res = await axios.get(`${BASE_URL}${queryCurrencies}`);

      const pair = res.data;

      const rate = this.toEquivalent(pair.src2Dest, decimals);

      return rate;
    } catch (e) {
      console.error(e);
    }
  }
};