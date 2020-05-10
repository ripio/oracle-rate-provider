const Marmo = require('marmojs');
const Provider = require('./src/Provider.js');
const storage = require('node-persist');
const Web3 = require('web3');
const read = require('read');
const util = require('util');
const logger = require('./src/logger.js');

const {
  sleep,
  instanceSigners
} = require('./src/utils.js');

// Presets and constants
const allPresets = require('./environment/presets.js');


async function pkFromKeyStore(w3, filepath) {
  try {
    var fs = require('fs');
    var keyObject = JSON.parse(fs.readFileSync(filepath));  

    var key = await util.promisify(read)({
      prompt: 'Key: ',
      silent: true,
      replace: '*',
    });

    const decrypted = w3.eth.accounts.decrypt(keyObject, key);
    return decrypted.privateKey;
  } catch (err) {
    logger.info(`Can't get private key from filepath: ${filepath}`);
  }
  return;
}

async function main() {
  // Parse defaults
  const defargv = require('yargs')
    .env('RCNORACLE_')
    .option(
      'n', {
        alias: 'network',
        required: false,
        describe: 'Ethereum Network ID',
        type: 'int',
        default: 3
      })
    .argv;

  const networkid = defargv.n;
  logger.info(`Starting oracle provider on Network ${networkid}`);
  if (!allPresets[networkid]) {
    logger.error(`Network ID: ${networkid} not valid`);
    process.exit(1);
  }

  const presets = allPresets[networkid];

  // Parse program init parameters
  const argv = require('yargs')
    .env('RCNORACLE_')
    .option('n', {
      alias: 'network',
      required: false,
      describe: 'Ethereum Network ID',
      type: 'int',
      default: 3
    })
    .option('p', {
      alias: 'private-key',
      required: false,
      describe: 'Private key for the relayer',
      type: 'string',
      default: undefined
    })
    .option('f', {
      alias: 'file-pk',
      required: false,
      describe: 'Path of a file with the private key',
      type: 'string'
    })
    .option('w', {
      alias: 'wait',
      describe: 'Wait time between each rate check (in secs)',
      required: false,
      type: 'int',
      default: 45
    })
    .option('mw', {
      alias: 'max-wait',
      describe: 'Max wait time between each provide, forces a provide (in secs)',
      required: false,
      type: 'int',
      default: 21600 // 6 hours
    })
    .option('k', {
      alias: 'key',
      describe: 'key passphrase to decrypt keystoreFile',
      required: false,
      type: 'string'
    })
    .option('a', {
      alias: 'address',
      describe: 'address of keystoreFile',
      required: false,
      type: 'string'
    })
    .option('c', {
      alias: 'currencies',
      descript: 'List of currencies to provide, separated by commas',
      required: false,
      type: 'string',
      default: presets.defaultCurrencies.join(',')
    })
    .option('oc', {
      alias: 'oracle-factory-contract',
      descript: 'Oracle Factory contract address',
      required: false,
      type: 'string',
      default: presets.contracts.oracleFactory
    })
    .option('uc', {
      alias: 'uniswap-factory-contract',
      descript: 'Uniswap Factory contract address',
      required: false,
      type: 'string',
      default: presets.contracts.uniswapFactory
    })
    .option('t', {
      alias: 'percentage-threshold',
      descript: 'Percentage delta required to update the rate',
      required: false,
      type: 'int',
      default: presets.percentageChange
    })
    .option('r', {
      alias: 'rpc',
      descript: 'Ethereum RPC node URL',
      required: false,
      type: 'string',
      default: presets.node
    })
    .argv;

  // Initialize W3
  const w3 = new Web3(new Web3.providers.HttpProvider(argv.rpc));

  // Initialize account
  let pk;
  if (argv.privateKey) {
    pk = argv.privateKey;
  } else if (argv.filePk) {
    pk = await pkFromKeyStore(w3, argv.filePk);
  }
  if (!pk) {
    pk = await util.promisify(read)({
      prompt: 'Private key: ',
      silent: true,
      replace: '*',
    });
  }

  const signer = await instanceSigners(w3, pk);
  logger.info(`Using account: ${signer.address}`);

  // Configure Marmo
  // FIXME: Configure marmo for real
  Marmo.DefaultConf.ROPSTEN.asDefault();

  // Start Provider
  const provider = await new Provider(w3, argv).init();

  // Initialize persitent storage
  await storage.init({
    dir: './src/persistRates'
  });

  let lastUpdate = new Date().getTime();

  logger.info('Start providing');
  for (; ;) {
    // Track if lastUpdate exceeded arg.maxWait
    // and force and update if that's the case
    const forceProvide = new Date().getTime() - lastUpdate > 1000 * argv.maxWait;
    if (forceProvide) {
      logger.info(`Force rate update because of time delta ${argv.maxWait}`);
    }

    // Try to provide rates and save if we provided anything
    try {
      const provided = await provider.provideRates(signer, forceProvide);
      if (provided) {
        // Update when was the last provide made
        lastUpdate = new Date().getTime();
      }
    } catch (e) {
      logger.warn(`Failed to try provide rates: ${e.toString().split('\n')[0]}`);
    }

    // Sleep until the next check
    logger.info(`Wait for next provide ${argv.wait} secs`);
    await sleep(argv.wait * 1000);
  }
}

main();
