const Market = require('./Market.js');
const UniswapFactory = require('../contracts/UniswapFactory.js');
const UniswapExchange = require('../contracts/UniswapExchange.js');
const OracleFactory = require('../contracts/OracleFactory.js');
const constants = require('../../environment/constants.js');
const logger = require('../logger.js');
const utils = require('../utils.js');

module.exports = class Uniswap extends Market {
  constructor(w3, options) {
    super(w3);
    this.w3 = w3;
    this.options = options;
    this.oracleFactory = new w3.eth.Contract(OracleFactory.abi, options.oracleFactoryContract);
    this.factory = new w3.eth.Contract(UniswapFactory.abi, options.uniswapFactoryContract);
    this.WEI = this.bn('1000000000000000000');
  }

  async init() {
    const base = constants[this.options.network].baseToken;
    const rcnExchangeAddress = await this.factory.methods.getExchange(base).call();
    this.rcnExchange = new this.w3.eth.Contract(UniswapExchange.abi, rcnExchangeAddress);
    return this;
  }

  async getRate(currency_from, currency_to, decimals) {
    let rate;

    const amountInRCN = this.bn('1000');// TODO think this amount
    const amountInWEI = this.WEI.mul(amountInRCN);

    let rateTo = await this.rcnExchange.methods.getEthToTokenOutputPrice(amountInWEI.toString()).call();
    rateTo = this.bn(rateTo);
    let rateFrom = await this.rcnExchange.methods.getTokenToEthInputPrice(amountInWEI.toString()).call();
    rateFrom = this.bn(rateFrom);
    // The average of rateFrom and ratoTo RCN
    const rateEth = rateTo.add(rateFrom).div(this.bn(2)).div(amountInRCN);

    if (currency_to === 'ETH') {
      return rateEth.toString();
    } else {
    
      // Get currency_to TEST/DEST TokenSwap rate
      const destAddress = await this.oracleFactory.methods.symbolToOracle(currency_to).call();
      if (destAddress === utils.address0x) {
        logger.info('Currency: ' + currency_to + ', the oracle dont exists');
      }

      const destExchangeAddress = await this.factory.methods.getExchange(destAddress).call();
      if (destExchangeAddress === utils.address0x) {
        logger.info('Exchange: ' + currency_to + ', dont exists');
        return;
      } 
      
      const destExchange = new this.w3.eth.Contract(UniswapExchange.abi, destExchangeAddress);
      const amountInDest = this.bn('1000');// TODO think this amount
      const amountInWEI = this.WEI.mul(amountInDest);

      let rateToDest = await destExchange.methods.getEthToTokenOutputPrice(amountInWEI.toString()).call();
      const rateTo = this.bn(rateToDest);

      let rateFromDest = await destExchange.methods.getTokenToEthInputPrice(amountInWEI.toString()).call();
      const rateFrom = this.bn(rateFromDest);

      const rateDest = rateTo.add(rateFrom).div(this.bn(2)).div(amountInDest);
      rate = this.bn(rateEth).mul(this.bn(10 ** decimals)).div(this.bn(rateDest));

    }
    return rate.toString();
  }
};
