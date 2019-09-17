const program = require('commander');
const Marmo = require('marmojs');
const Provider = require('./src/Provider.js');
const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');
const { sleep, importFromFile } = require('./src/utils.js');
const storage = require('node-persist');

async function pkFromKeyStore(address, key) {
  var keyObject = importFromFile(address);

  const decrypted = w3.eth.accounts.decrypt(keyObject, key);

  return decrypted.privateKey;
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
    );

  program.parse(process.argv);

  const pk = program.PK ? program.PK : program.filePk ?
    program.filePk[0] : process.env.PK ? process.env.PK : await pkFromKeyStore(program.address, program.key);

  const wait = process.env.WAIT  ? process.env.WAIT  : program.wait;
  const waitMs = wait * 60 * 1000;

  const waitMarket = process.env.WAIT_MARKET  ? process.env.WAIT_MARKET : program.waitMarket;

  console.log('WAIT_NEXT_PROVIDE_ALL:', wait + 'm');
  console.log('WAIT_NEXT_GET_MARKET_DATA:', waitMarket + 'm');  

  const oracleFactory = await instanceOracleFactory();
  const oracles = await instanceOracles(oracleFactory);
  const signer = await instanceSigners(pk);

  const provider = await new Provider(w3, oracleFactory, oracles).init();
  Marmo.DefaultConf.ROPSTEN.asDefault();

  // Initialize persitent storage
  await storage.init({
    dir: './src/persistRates'
  });

  // To do env variable waitMarketData
  const waitMarketData = waitMarket * 60 * 1000;

  for (;;) {
    console.log('PROVIDE ALL');
    await provider.provideRates(signer, true);

    console.log('Wait for next provide All: ' +  wait + 'ms'  + '\n');
    await sleep(waitMarketData);
    
    let t = 0;
    while (t < waitMs) {
      console.log('\n' + 'PROVIDE ONLY RATE CHANGE > 1%');
      await provider.provideRates(signer, false);
      
      console.log('Wait ' + waitMarket + 'm and gather market data again');
      await sleep(waitMarketData);

      t += waitMarketData; 
    }

  }
}

main();
