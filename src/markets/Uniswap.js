const Market = require('./Market.js');
const UniswapFactory = require('../contracts/UniswapFactory.js');
const constants = require('../../environment/constants.js');

module.exports = class Uniswap extends Market {
  constructor(w3, options) {
    super(w3);
    this.w3 = w3;
    this.options = options;
    this.factory = new w3.eth.Contract(UniswapFactory.abi, options.uniswapFactoryAddress);
    this.WEI = this.bn('1000000000000000000');
  }

  async init() {
    const base = constants[this.options.network].baseToken;
    this.rcnExchange.address = await this.factory.methods.getExchange(base).call();
    return this;
  }

  async getRate(currency_from, currency_to, decimals) {
    let rate;
    if (process.env.NETWORK == 'mainnet') {
      // TODO remove this when use in mainnet
      // change to mainnet netEnv
      // const w3 = new W3(new W3.providers.HttpProvider('https://mainnet.infura.io/v3/f6427a6723594cdd8affb596d357d268'));
      // this.rcnExchange = new w3.eth.Contract(netEnv.markets.uniswap.exchangeABI, '0xD91FF16Ef92568fC27F466C3c5613e43313Ab1dc');
      // TODO_END

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

    if (process.env.NETWORK == 'ropsten') {
      const rcnExchange = await new w3.eth.Contract(netEnv.markets.uniswap.exchangeABI, this.rcnExchange.address);

      // console.log(rcnExchange);
      const amountInRCN = this.bn('1000');// TODO think this amount
      const amountInWEI = this.WEI.mul(amountInRCN);

      let rateTo = await rcnExchange.methods.getEthToTokenOutputPrice(amountInWEI.toString()).call();
      rateTo = this.bn(rateTo);

      let rateFrom = await rcnExchange.methods.getTokenToEthInputPrice(amountInWEI.toString()).call();
      rateFrom = this.bn(rateFrom);

      const rateTest = rateTo.add(rateFrom).div(this.bn(2)).div(amountInRCN);

      if (currency_to === 'ETH') {
        rate = rateTest;
      } else {
        // Get currency_to TEST/DEST TokenSwap rate

        const w3 = new W3(new W3.providers.HttpProvider(netEnv.node));
        const destExchangeAddress = await this.factory.methods.getExchange(netEnv.destToken).call();
        const destExchange = await new w3.eth.Contract(netEnv.markets.uniswap.exchangeABI, destExchangeAddress);

        const amountInDest = this.bn('1000');// TODO think this amount
        const amountInWEI = this.WEI.mul(amountInDest);

        let rateToDest = await destExchange.methods.getEthToTokenOutputPrice(amountInWEI.toString()).call();
        rateTo = this.bn(rateToDest);

        let rateFromDest = await destExchange.methods.getTokenToEthInputPrice(amountInWEI.toString()).call();
        rateFrom = this.bn(rateFromDest);

        const rateDest = rateTo.add(rateFrom).div(this.bn(2)).div(amountInDest);
        rate = this.bn(rateTest).mul(this.bn(10 ** decimals)).div(this.bn(rateDest));

      }
      return rate.toString();
    }

    return 'Incorrect network';

  }
};
