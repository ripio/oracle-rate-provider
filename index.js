const program = require('commander');
const Marmo = require('marmojs');
const Provider = require('./src/Provider.js');
const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');
const { sleep } = require('./src/utils.js');

const env = require('./environment.js');

async function main(){
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

  const pks = program.listPks.concat(program.filePks);

  const oracleFactory = await instanceOracleFactory();
  const oracles = await instanceOracles(oracleFactory);
  const signers = await instanceSigners(pks);

  const provider = await new Provider(w3, oracleFactory, oracles).init();
  Marmo.DefaultConf.ROPSTEN.asDefault();

  for (;;) {

    for (let signer of signers) {
      provider.provideRates(signer);
    }

    console.log('Wait: ' + env.wait);
    await sleep(env.wait);

  }
}

main();
