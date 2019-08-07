const program = require('commander');

const Provider = require('./src/Provider.js');
const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');
const { sleep } = require('./src/utils.js');

const env = require('./environment.js');

async function main(){
  program
    .option(
      '-s, --listPks <pks>',
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

  await instanceSigners(pks);
  const oracleFactory = await instanceOracleFactory();
  const oracles = await instanceOracles(oracleFactory);

  const provider = new Provider(w3, oracleFactory);

  for (;;) {
    for(const oracle of oracles){
      for(const signer of oracle.signers) {
        provider.provideRate(oracle, signer);
      }
    }

    console.log('Wait: ' + env.wait);
    await sleep(env.wait);
  }
}

main();
