module.exports = {
  1: {
    node: 'https://node.rcn.loans/',
    contracts: {
      oracleFactory: '0x1101c52fc25dc6d2691cec4b06569cef3c83933c',
      uniswapFactory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'
    },
    percentageChange: 2,
    defaultCurrencies: [
      'ARS'
    ]
  },
  3: {
    node: 'https://ropsten-node.rcn.loans/',
    contracts: {
      oracleFactory: '0xf9d4771CBE3C3808f3DfF633Cd6BE738F7f419EA',
      uniswapFactory: '0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351'
    },
    percentageChange: 1,
    defaultCurrencies: [
      'ETH',
      'BTC',
      'USD',
      'ARS',
      'DAI',
      'MANA',
      'DEST'
    ]
  }
};
