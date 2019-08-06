const nodes = {
  infura: {
    ropsten: 'https://ropsten.infura.io/v3/f6427a6723594cdd8affb596d357d268',
    mainnet: 'https://mainnet.infura.io/v3/f6427a6723594cdd8affb596d357d268',
  },
  rcn: {
    ropsten: 'http://ropsten.node.rcn.loans:8545',
    mainnet: 'http://main.node.rcn.loans:8545',
  },
  local: 'http://localhost:8545',
};

const accountsExchangeIds = [
  'binance',
  'gateio',
  'gateio',
  'huobipro',
  'huobiru',
  'binance',
  'gateio',
  'huobiru',//'uniswap',
  'binance',//'kyber',
  'gateio',//'uniswap'
];

const oracleFactory = {
  ropsten: {
    address: '0xf8015eA8c66d6238b0B22788468407a7360AaE5e',
    contractName: 'OracleFactory',
    abi: [
      {
        'constant': true,
        'inputs': [
          {
            'name': '',
            'type': 'string'
          }
        ],
        'name': 'symbolToOracle',
        'outputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'owner',
        'outputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'name': 'oracleToSymbol',
        'outputs': [
          {
            'name': '',
            'type': 'string'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_newOwner',
            'type': 'address'
          }
        ],
        'name': 'transferOwnership',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'anonymous': false,
        'inputs': [
          {
            'indexed': false,
            'name': '_symbol',
            'type': 'string'
          },
          {
            'indexed': false,
            'name': '_oracle',
            'type': 'address'
          }
        ],
        'name': 'NewOracle',
        'type': 'event'
      },
      {
        'anonymous': false,
        'inputs': [
          {
            'indexed': true,
            'name': '_from',
            'type': 'address'
          },
          {
            'indexed': true,
            'name': '_to',
            'type': 'address'
          }
        ],
        'name': 'OwnershipTransferred',
        'type': 'event'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_symbol',
            'type': 'string'
          }
        ],
        'name': 'newOracle',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_oracle',
            'type': 'address'
          },
          {
            'name': '_signer',
            'type': 'address'
          }
        ],
        'name': 'addSigner',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_oracle',
            'type': 'address'
          },
          {
            'name': '_signer',
            'type': 'address'
          }
        ],
        'name': 'removeSigner',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_oracle',
            'type': 'address'
          },
          {
            'name': '_rate',
            'type': 'uint256'
          }
        ],
        'name': 'provide',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_data',
            'type': 'bytes32[]'
          }
        ],
        'name': 'provideMultiple',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      }
    ],
  }
};

const oracle = {
  ropsten: {
    symbols: [
      'ETH'
    ],
    contractName: 'MultiSourceOracle',
    abi: [
      {
        'constant': true,
        'inputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'name': 'isSigner',
        'outputs': [
          {
            'name': '',
            'type': 'bool'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'owner',
        'outputs': [
          {
            'name': '',
            'type': 'address'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'BASE',
        'outputs': [
          {
            'name': '',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_newOwner',
            'type': 'address'
          }
        ],
        'name': 'transferOwnership',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'inputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
      },
      {
        'anonymous': false,
        'inputs': [
          {
            'indexed': true,
            'name': '_from',
            'type': 'address'
          },
          {
            'indexed': true,
            'name': '_to',
            'type': 'address'
          }
        ],
        'name': 'OwnershipTransferred',
        'type': 'event'
      },
      {
        'constant': true,
        'inputs': [
          {
            'name': '_addr',
            'type': 'address'
          }
        ],
        'name': 'getProvided',
        'outputs': [
          {
            'name': '_topHeap',
            'type': 'bool'
          },
          {
            'name': '_botHeap',
            'type': 'bool'
          },
          {
            'name': '_rate',
            'type': 'uint256'
          },
          {
            'name': '_indexHeap',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_signer',
            'type': 'address'
          }
        ],
        'name': 'addSigner',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_signer',
            'type': 'address'
          }
        ],
        'name': 'removeSigner',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_signer',
            'type': 'address'
          },
          {
            'name': '_rate',
            'type': 'uint256'
          }
        ],
        'name': 'provide',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [
          {
            'name': '',
            'type': 'bytes'
          }
        ],
        'name': 'readSample',
        'outputs': [
          {
            'name': '',
            'type': 'uint256'
          },
          {
            'name': '',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'readSample',
        'outputs': [
          {
            'name': '_tokens',
            'type': 'uint256'
          },
          {
            'name': '_equivalent',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      }
    ],
  }
};

module.exports = {
  node: nodes.infura.ropsten,
  oracleFactory: oracleFactory.ropsten,
  oracle: oracle.ropsten,
  wait: 50000,
  exchangeIds: accountsExchangeIds
};
