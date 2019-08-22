module.exports = class Market {
  constructor(w3) {
    this.w3 = w3;
  }

  bn (number) {
    return this.w3.utils.toBN(number);
  }

  toEquivalent (rate) {
    return this.bn(rate * 10 ** 18).toString();
  }

  async getRate() {
    throw new Error('Function getRate not implemented ');
  }
};
