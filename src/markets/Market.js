module.exports = class Market {
  constructor(w3) {
    this.w3 = w3;
  }

  bn (number) {
    return this.w3.utils.toBN(number);
  }


  toEquivalent (rate, decimals) {
    return this.bn(parseInt(rate * (10 ** decimals))).toString();
  }

  async getRate() {
    throw new Error('Function getRate not implemented ');
  }
};
