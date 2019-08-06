const program = require('commander');

const Provider = require('./src/Provider.js');
const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');
const { sleep } = require('./src/utils.js');

const env = require('./environment.js');

async function main(){
  program
    .option(
      '-s, --listSeeds <seeds>',
      'An array of seeds(private keys or entropy strings)',
      seeds => seeds.split(',')
    )
    .option(
      '-f, --fileSeeds <path>',
      'The path of a file with an array of seeds(private keys or entropy strings)',
      path => require(path)
    );

  program.parse(process.argv);

  if (program.listSeeds === undefined) program.listSeeds = [];
  if (program.fileSeeds === undefined) program.fileSeeds = [];

  const listSeeds = program.listSeeds.concat(program.fileSeeds);

  await instanceSigners(listSeeds);
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
