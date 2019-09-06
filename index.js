const program = require('commander');
const Marmo = require('marmojs');
const Provider = require('./src/Provider.js');
const { w3, instanceSigners, instanceOracleFactory, instanceOracles } = require('./src/constructors.js');
const { sleep, importFromFile } = require('./src/utils.js');


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
      15
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

  const wait = program.wait ? program.wait : process.env.WAIT;
  const waitMs = wait * 60 * 1000;

  const oracleFactory = await instanceOracleFactory();
  const oracles = await instanceOracles(oracleFactory);
  const signer = await instanceSigners(pk);

  const provider = await new Provider(w3, oracleFactory, oracles).init();
  Marmo.DefaultConf.ROPSTEN.asDefault();

  for (;;) {
    await provider.provideRates(signer);

    console.log('Wait: ' + waitMs + 'ms');
    await sleep(waitMs);

  }
}

main();
