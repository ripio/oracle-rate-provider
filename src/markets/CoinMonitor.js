const Market = require('./Market.js');
const constants = require('../../environment/constants.js');
const axios = require('axios');

module.exports = class CoinMonitor extends Market {

  constructor(w3) {
    super(w3);
  }

  async getRate(currency_from, currency_to, decimals) {

    const BASE_URL = constants.shared.exchanges.coinMonitor.url;

    try {

      const res = await axios.get(`${BASE_URL}`);
    
      const pair = res.data;

      const rate = this.toEquivalent(pair.BTC_avr_ars, decimals);
      return rate;
    } catch (e) {
      console.error(e);
    }
  }
};
