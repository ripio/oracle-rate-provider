const Market = require('./Market.js');
const constants = require('../../environment/constants.js');
const axios = require('axios');

module.exports = class SatoshiTango extends Market {

  constructor(w3) {
    super(w3);
  }

  async getRate(currency_from, currency_to, decimals) {

    const BASE_URL = constants.shared.exchanges.satoshiTango.url;

    try {

      const res = await axios.get(`${BASE_URL}${currency_to}`);
    
      const pair = res.data;
      const arsBid = pair.data.ticker[currency_from].bid;  
      const arsAsk = pair.data.ticker[currency_from].ask; 
      const rateProvided = (arsBid + arsAsk) / 2;

      const rate = this.toEquivalent(rateProvided, decimals);
      return rate;
    } catch (e) {
      console.error(e);
    }
  }
};
