const program = require('commander');
const Marmo = require('marmojs');
const Provider = require('./src/Provider.js');
const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');
const { sleep } = require('./src/utils.js');

const env = require('./environment.js');

async function main() {
  await sleep(process.env.SLEEP_FIRST);

  program
    .option(
      '-p, --listPks <pks>',
      'An array of private keys',
      pks => pks.split(',')
    )
    .option(
      '-f, --filePks <path>',
      'The path of a file with an array of private keys',
      path => require(path)
    );

  program.parse(process.argv);

  if (!program.listPks) program.listPks = [];
  if (!program.filePks) program.filePks = [];


  const pks = process.env.PK;

  const oracleFactory = await instanceOracleFactory();
  const oracles = await instanceOracles(oracleFactory);
  const signer = await instanceSigners(pks);

  const provider = await new Provider(w3, oracleFactory, oracles).init();
  Marmo.DefaultConf.ROPSTEN.asDefault();

  for (;;) {
    provider.provideRates(signer);

    console.log('Wait: ' + env.wait + 'ms');
    await sleep(env.wait);

  }
}

main();
