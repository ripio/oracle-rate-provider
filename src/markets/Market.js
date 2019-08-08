module.exports = class Market {
  constructor(w3) {
    this.w3 = w3;
  }

  bn (number) {
    return new this.w3.utils.BN(number);
  }

  async getRate() {
    throw new Error('Function getRate not implemented ');
  }
};
