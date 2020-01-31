module.exports = {
  shared: {
    exchanges: {
      reuters: {
        url: 'https://www.reuters.com/assets/'
      },
      ripioExchangeApi: {
        url:'https://api.exchange.ripio.com/api/v1/usd/'
      },
      ripio: {
        url:'https://ripio.com/api/v1/rates/'
      },
      bitex: {
        url:'https://bitex.la/api/tickers/'
      },
      satoshiTango: {
        url:'https://api.satoshitango.com/v3/ticker/'
      }
    }
  },
  1: {
    baseCurrency: 'RCN',
    baseToken: '0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6'
  },
  3: {
    baseCurrency: 'TEST',
    baseToken: '0x2f45b6Fb2F28A73f110400386da31044b2e953D4'
  }
};
