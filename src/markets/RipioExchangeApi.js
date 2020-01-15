const Market = require('./Market.js');
const env = require('../../environment.js');
const axios = require('axios');

const netEnv = process.env.NETWORK == 'mainnet' ? env.main : env.ropsten;

module.exports = class RipioExchangeApi extends Market {

  constructor(w3) {
    super(w3);
  }

  async getRate(currency_from, currency_to, decimals) {

    const BASE_URL = netEnv.ripioExchangeApi;
    // const queryCurrencies = 'jsonCurrencyConverter?' + 'srcCurr=' + currency_from + '&destCurr=' + currency_to;

    try {
      
      const res = await axios.get(`${BASE_URL}`);

      const pair = res.data;

      const rate = this.toEquivalent(pair.USD_ARS, decimals);

      return rate;
    } catch (e) {
      console.error(e);
    }
  }
};