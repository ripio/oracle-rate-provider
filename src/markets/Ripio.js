const Market = require('./Market.js');
const constants = require('../../environment/constants.js');
const axios = require('axios');

module.exports = class Ripio extends Market {

  constructor(w3) {
    super(w3);
  }

  async getRate(currency_from, currency_to, decimals) {

    const BASE_URL = constants.shared.exchanges.ripio.url;

    try {

      const res = await axios.get(`${BASE_URL}`);
    
      const pair = res.data;
      const arsBuy = pair.rates.ARS_BUY;  
      const arsSell = pair.rates.ARS_SELL; 
      const rateProvided = (arsBuy + arsSell) / 2;

      const rate = this.toEquivalent(rateProvided, decimals);
      return rate;
    } catch (e) {
      console.error(e);
    }
  }
};
