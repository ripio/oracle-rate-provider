const Market = require('./Market.js');
const constants = require('../../environment/constants.js');
const axios = require('axios');

module.exports = class Bitex extends Market {

  constructor(w3) {
    super(w3);
  }

  async getRate(currency_from, currency_to, decimals) {

    const BASE_URL = constants.shared.exchanges.bitex.url;

    try {

      const res = await axios.get(`${BASE_URL}`);
    
      const pair = res.data;
      const rateProvided = pair.data.find(x => x.id === 'btc_ars').attributes.last;

      const rate = this.toEquivalent(rateProvided, decimals);
      return rate;
    } catch (e) {
      console.error(e);
    }
  }
};
