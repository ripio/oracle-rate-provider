module.exports.sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.address0x = '0x0000000000000000000000000000000000000000';

/**
  * Import key data object from keystore JSON file.
  * @param {string} address Ethereum address to import.
  * @param {string=} datadir Ethereum data directory (default: ~/.ethereum).
  * @param {function=} cb Callback function (optional).
  * @return {Object} Keystore data file's contents.
  */
module.exports.importFromFile = (address, datadir, cb) => {
  var keystore, filepath, path, fs;
  path = require('path');
  fs = require('fs');
  address = address.replace('0x', '');
  address = address.toLowerCase();

  function findKeyfile(keystore, address, files) {
    var i, len, filepath = null;
    for (i = 0, len = files.length; i < len; ++i) {
      if (files[i].indexOf(address) > -1) {
        filepath = path.join(keystore, files[i]);
        if (fs.lstatSync(filepath).isDirectory()) {
          filepath = path.join(filepath, files[i]);
        }
        break;
      }
    }
    return filepath;
  }

  function isFunction(f) {
    return typeof f === 'function';
  }

  datadir = datadir || path.join(process.env.HOME, '.ethereum');
  keystore = path.join(datadir, 'keystore');
  if (!isFunction(cb)) {
    filepath = findKeyfile(keystore, address, fs.readdirSync(keystore));
    if (!filepath) {
      throw new Error('could not find key file for address ' + address);
    }
    return JSON.parse(fs.readFileSync(filepath));
  }
  fs.readdir(keystore, function (ex, files) {
    var filepath;
    if (ex) return cb(ex);
    filepath = findKeyfile(keystore, address, files);
    if (!filepath) {
      return new Error('could not find key file for address ' + address);
    }
    return cb(JSON.parse(fs.readFileSync(filepath)));
  });
};

module.exports.instanceSigners = async (w3, pk) => {
  if (!(pk)) throw new Error('There are no private keys to instance the signers: ' + pk);

  let signer;
  if (w3.utils.isHexStrict(pk)) {
    signer = w3.eth.accounts.privateKeyToAccount(pk);
    w3.eth.accounts.wallet.add(signer);
  } else {
    console.error('The private key its not valid: ' + pk);
  }

  return signer;
};
