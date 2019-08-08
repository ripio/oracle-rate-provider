const Binance = require('./markets/Binance.js');

module.exports = class Markets {
  constructor(w3) {
    this.w3 = w3;

    this.markets = this.instanceMarkets(w3);
  }

  instanceMarkets (w3) {
    const markets = [];

    markets['binance'] = new Binance(w3, 'binance');
    // TODO
    //markets['bitfinex'] = new Bitfinex(w3, 'bitfinex');
    //markets['gateio'] = new Gateio(w3, 'gateio');
    //markets['huobipro'] = new Huobipro(w3, 'huobipro');
    //markets['huobiru'] = new Huobiru(w3, 'huobiru');
    //markets['kyber'] = new Kyber(w3, 'kyber');
    //markets['uniswap'] = new Uniswap(w3, 'uniswap');

    return markets;
  }

  bn (number) {
    return new this.w3.utils.BN(number);
  }

  toEquivalent (rate) {
    return this.bn(rate * 10 ** 18).toString();
  }

  async getRate(data) {
    let rate;
    try {
      rate = await this.markets[data.exchangeId].getRate(data.currency);
    } catch(e) {
      console.log('Error message: ' + e.message);
    }

    return this.toEquivalent(rate);
  }
}
