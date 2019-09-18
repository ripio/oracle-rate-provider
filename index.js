const program = require('commander');
const Marmo = require('marmojs');
const Provider = require('./src/Provider.js');
const { sleep, importFromFile } = require('./src/utils.js');
const storage = require('node-persist');
const env = require('./environment.js');

async function pkFromKeyStore(w3, address, key) {
  var keyObject = importFromFile(address);

  const decrypted = w3.eth.accounts.decrypt(keyObject, key);

  return decrypted.privateKey;
}

async function provideTestRates(provider, signer, netEnv, provideAll) {

  const notMatchOracles = env.ropsten.oracles.filter(c => !env.ropsten.oraclesFromMain.includes(c));

  console.log('Get Test Rates');
  await provider.provideRates(signer, env.ropsten.primaryCurrency, notMatchOracles, provideAll);
  signer.data = env.main.signersData;

  console.log('\n' + 'Get Main Rates');
  await provider.provideRates(signer, env.main.primaryCurrency, netEnv.oraclesFromMain, provideAll);
  signer.data = env.ropsten.signersData;
}

async function main() {
  program
    .option(
      '-p, --PK <pk>',
      'private keys'
    )
    .option(
      '-f, --filePk <path>',
      'The path of a file with the private key',
      path => require(path)
    )
    .option(
      '-w, --wait <wait>',
      'The time to wait for a new provide',
      360
    )
    .option(
      '-m, --waitMarket <waitMarket>',
      'The time to wait to gather market data',
      3
    )
    .option(
      '-k, --key <key>',
      'key passphrase to decrypt keystoreFile',
      ''
    )
    .option(
      '-a, --address <address>',
      'address of private key to decrypt keystoreFile',
      ''
    )
    .option(
      '-n, --network <network>',
      'network',
      'mainnet'
    );

  program.parse(process.argv);

  // Initialize network
  if (!process.env.NETWORK) {
    process.env.NETWORK = program.network;
  }
  console.log('Network: ', process.env.NETWORK);
  const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');

  const pk = program.PK ? program.PK : program.filePk ?
    program.filePk[0] : process.env.PK ? process.env.PK : await pkFromKeyStore(w3, program.address, program.key);

  const oracleFactory = await instanceOracleFactory();
  const oracles = await instanceOracles(oracleFactory);
  let signer = await instanceSigners(pk);

  const provider = await new Provider(w3, oracleFactory, oracles).init();
  Marmo.DefaultConf.ROPSTEN.asDefault();

  const wait = process.env.WAIT ? process.env.WAIT : program.wait;
  const waitMs = wait * 60 * 1000;

  const waitMarket = process.env.WAIT_MARKET ? process.env.WAIT_MARKET : program.waitMarket;

  console.log('WAIT_NEXT_PROVIDE_ALL:', wait + 'm');
  console.log('WAIT_NEXT_GET_MARKET_DATA:', waitMarket + 'm' + '\n' );

  // Initialize persitent storage
  await storage.init({
    dir: './src/persistRates'
  });

  const waitMarketData = waitMarket * 60 * 1000;
  const netEnv = process.env.NETWORK == 'mainnet' ? env.main : env.ropsten;

  for (; ;) {
    console.log('PROVIDE ALL');

    if (process.env.NETWORK != 'mainnet') {
      await provideTestRates(provider, signer, netEnv, true);
    } else {
      await provider.provideRates(signer, netEnv.primaryCurrency, netEnv.oracles, true);
    }

    console.log('Wait for next provide All: ' + wait + 'ms' + '\n');
    await sleep(waitMarketData);

    let t = 0;
    while (t < waitMs) {
      console.log('\n' + 'PROVIDE ONLY RATE CHANGE > 1%');
      if (process.env.NETWORK != 'mainnet') {
        await provideTestRates(provider, signer, netEnv, false);
      } else {
        await provider.provideRates(signer, netEnv.primaryCurrency, netEnv.oracles, false);
      }

      console.log('Wait ' + waitMarket + 'm and gather market data again');
      await sleep(waitMarketData);

      t += waitMarketData;
    }

  }
}

main();
