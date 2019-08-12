module.exports.nodes = {
  infura: 'https://ropsten.infura.io/v3/f6427a6723594cdd8affb596d357d268',
  rcn: 'http://ropsten.node.rcn.loans:8545',
  local: 'http://localhost:8545',
};

module.exports.RCNToken = '0x2f45b6Fb2F28A73f110400386da31044b2e953D4';

module.exports.markets = {
  uniswap: {
    address: '0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351',
    abi: [
      {
        'name': 'NewExchange',
        'inputs': [
          {
            'type': 'address',
            'name': 'token',
            'indexed': true
          },
          {
            'type': 'address',
            'name': 'exchange',
            'indexed': true
          }
        ],
        'anonymous': false,
        'type': 'event'
      },
      {
        'name': 'initializeFactory',
        'outputs': [],
        'inputs': [
          {
            'type': 'address',
            'name': 'template'
          }
        ],
        'constant': false,
        'payable': false,
        'type': 'function',
        'gas': 35725
      },
      {
        'name': 'createExchange',
        'outputs': [
          {
            'type': 'address',
            'name': 'out'
          }
        ],
        'inputs': [
          {
            'type': 'address',
            'name': 'token'
          }
        ],
        'constant': false,
        'payable': false,
        'type': 'function',
        'gas': 187911
      },
      {
        'name': 'getExchange',
        'outputs': [
          {
            'type': 'address',
            'name': 'out'
          }
        ],
        'inputs': [
          {
            'type': 'address',
            'name': 'token'
          }
        ],
        'constant': true,
        'payable': false,
        'type': 'function',
        'gas': 715
      },
      {
        'name': 'getToken',
        'outputs': [
          {
            'type': 'address',
            'name': 'out'
          }
        ],
        'inputs': [
          {
            'type': 'address',
            'name': 'exchange'
          }
        ],
        'constant': true,
        'payable': false,
        'type': 'function',
        'gas': 745
      },
      {
        'name': 'getTokenWithId',
        'outputs': [
          {
            'type': 'address',
            'name': 'out'
          }
        ],
        'inputs': [
          {
            'type': 'uint256',
            'name': 'token_id'
          }
        ],
        'constant': true,
        'payable': false,
        'type': 'function',
        'gas': 736
      },
      {
        'name': 'exchangeTemplate',
        'outputs': [
          {
            'type': 'address',
            'name': 'out'
          }
        ],
        'inputs': [],
        'constant': true,
        'payable': false,
        'type': 'function',
        'gas': 633
      },
      {
        'name': 'tokenCount',
        'outputs': [
          {
            'type': 'uint256',
            'name': 'out'
          }
        ],
        'inputs': [],
        'constant': true,
        'payable': false,
        'type': 'function',
        'gas': 663
      }
    ],
  }
};

module.exports.oracleFactory = {
  address: '0x6d412cd92558301f69F82996630a340b6BC2a9cD',
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
          'indexed': false,
          'name': '_oracle',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': '_signer',
          'type': 'address'
        }
      ],
      'name': 'AddSigner',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': '_oracle',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': '_signer',
          'type': 'address'
        }
      ],
      'name': 'RemoveSigner',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': '_oracle',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': '_signer',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': '_rate',
          'type': 'uint256'
        }
      ],
      'name': 'Provide',
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
        },
        {
          'name': '_name',
          'type': 'string'
        },
        {
          'name': '_decimals',
          'type': 'uint256'
        },
        {
          'name': '_token',
          'type': 'address'
        },
        {
          'name': '_maintainer',
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
          'name': '_name',
          'type': 'string'
        }
      ],
      'name': 'setName',
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
          'name': '_maintainer',
          'type': 'string'
        }
      ],
      'name': 'setMaintainer',
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
    }
  ]
};

module.exports.oracle = {
  contractName: 'MultiSourceOracle',
  abi: [
    {
      'constant': true,
      'inputs': [],
      'name': 'sizeOf',
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
      'constant': true,
      'inputs': [
        {
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'getValue',
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
          'name': '_addr',
          'type': 'address'
        },
        {
          'name': '_value',
          'type': 'uint256'
        }
      ],
      'name': 'newNode',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'remove',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'getNode',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        },
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
      'inputs': [
        {
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'exists',
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
      'inputs': [
        {
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'getNextNode',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
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
      'name': 'median',
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
      'constant': false,
      'inputs': [
        {
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'insert',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'id',
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
      'constant': true,
      'inputs': [],
      'name': 'VERSION',
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
      'inputs': [
        {
          'name': '_symbol',
          'type': 'string'
        },
        {
          'name': '_name',
          'type': 'string'
        },
        {
          'name': '_decimals',
          'type': 'uint256'
        },
        {
          'name': '_token',
          'type': 'address'
        },
        {
          'name': '_currency',
          'type': 'bytes32'
        },
        {
          'name': '_maintainer',
          'type': 'string'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': '_prev',
          'type': 'string'
        },
        {
          'indexed': false,
          'name': '_new',
          'type': 'string'
        }
      ],
      'name': 'SetName',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': '_prev',
          'type': 'string'
        },
        {
          'indexed': false,
          'name': '_new',
          'type': 'string'
        }
      ],
      'name': 'SetMaintainer',
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
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'AddNode',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': '_id',
          'type': 'uint256'
        }
      ],
      'name': 'RemoveNode',
      'type': 'event'
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
      'name': 'symbol',
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
      'constant': true,
      'inputs': [],
      'name': 'name',
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
      'constant': true,
      'inputs': [],
      'name': 'decimals',
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
      'constant': true,
      'inputs': [],
      'name': 'token',
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
      'name': 'currency',
      'outputs': [
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'maintainer',
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
      'constant': true,
      'inputs': [],
      'name': 'url',
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
          'name': '_rate',
          'type': 'uint256'
        },
        {
          'name': '_index',
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
          'name': '_name',
          'type': 'string'
        }
      ],
      'name': 'setName',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_maintainer',
          'type': 'string'
        }
      ],
      'name': 'setMaintainer',
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
    }
  ],
};
