const Binance = require('./markets/Binance.js');
const HuobiPro = require('./markets/HuobiPro.js');
const Bittrex = require('./markets/Bittrex.js');
const Upbit = require('./markets/Upbit.js');
const HitBTC = require('./markets/HitBTC.js');
const Kraken = require('./markets/Kraken.js');
const Gemini = require('./markets/Gemini.js');
const Reuters = require('./markets/Reuters.js');
const RipioExchangeApi = require('./markets/RipioExchangeApi.js');
const Ripio = require('./markets/Ripio.js');
const Uniswap = require('./markets/Uniswap.js');

const logger = require('./logger.js');

module.exports = class MarketsManager {
  constructor(w3, options) {
    this.w3 = w3;
    this.options = options;
    this.markets = [];
  }

  async init() {
    this.markets['binance'] = new Binance(this.w3, 'binance');
    this.markets['uniswap'] = await new Uniswap(this.w3, this.options).init();
    this.markets['huobipro'] = await new HuobiPro(this.w3, 'huobipro');
    this.markets['bittrex'] = await new Bittrex(this.w3, 'bittrex');
    this.markets['upbit'] = await new Upbit(this.w3, 'upbit');
    this.markets['hitbtc'] = await new HitBTC(this.w3, 'hitbtc');
    this.markets['kraken'] = await new Kraken(this.w3, 'kraken');
    this.markets['gemini'] = await new Gemini(this.w3, 'gemini');
    this.markets['reuters'] = await new Reuters(this.w3);
    this.markets['ripioExchangeApi'] = await new RipioExchangeApi(this.w3);
    this.markets['ripio'] = await new Ripio(this.w3);
    return this;
  }

  bn(number) {
    return new this.w3.utils.BN(number);
  }

  async getRate(data) {
    let rate;

    try {
      rate = await this.markets[data.exchangeId].getRate(data.currency_from, data.currency_to, data.decimals);
    } catch (e) {
      logger.warn(`Error loading rate ${data.currency_from}/${data.currency_to} from ${data.exchangeId}: ${e.toString().split('\n')[0]}`);
    }

    return rate;
  }
};
