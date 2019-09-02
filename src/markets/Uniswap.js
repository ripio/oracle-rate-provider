const Market = require('./Market.js');

const env = require('../../environment.js');

module.exports = class Binanace extends Market {
  constructor(w3) {
    super(w3);

    this.factory = new w3.eth.Contract(env.markets.uniswap.factoryABI, env.markets.uniswap.address);

    this.otherExchange = new w3.eth.Contract(env.markets.uniswap.exchangeABI);
    this.rcnExchange = new w3.eth.Contract(env.markets.uniswap.exchangeABI);
    this.WEI = this.bn('1000000000000000000');
  }

  async init() {
    this.rcnExchange.address = await this.factory.methods.getExchange(env.RCN).call();
    return this;
  }

  async getRate(currency_from, currency_to, decimals) {
    // TODO remove this when use in mainnet
    const W3 = require('web3');
    const w3 = new W3(new W3.providers.HttpProvider('https://mainnet.infura.io/v3/f6427a6723594cdd8affb596d357d268'));
    this.rcnExchange = new w3.eth.Contract(env.markets.uniswap.exchangeABI, '0xD91FF16Ef92568fC27F466C3c5613e43313Ab1dc');
    // TODO_END

    let rate;
    if (currency_to === 'ETH') {
      const amountInRCN = this.bn('1000');// TODO think this amount
      const amountInWEI = this.WEI.mul(amountInRCN);

      let rateTo = await this.rcnExchange.methods.getEthToTokenOutputPrice(amountInWEI.toString()).call();
      rateTo = this.bn(rateTo);
      let rateFrom = await this.rcnExchange.methods.getTokenToEthInputPrice(amountInWEI.toString()).call();
      rateFrom = this.bn(rateFrom);
      // The average of rateFrom and ratoTo RCN
      rate = rateTo.add(rateFrom).div(this.bn(2)).div(amountInRCN);
    } else {
      // TODO integrate other currencies(ERC20 tokensp)
    }
    return rate.toString();
  }
};
