# Oracle-rate-provider

## Install

Open your console and run:

```
$ git clone git@github.com:rotcivegaf/emyto-token-escrow.git
$ cd emyto-token-escrow
$ npm install
```

## Commands

|    Command    | Description |
| :-----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--PK` or `-p` | (unique)  To load the signer from a private key |
| `--filePk` or `-f` | (unique) A text file with the private key inside |
| `--key` or `-k` | (unique) Key passphrase to decrypt keystoreFile |
| `--address` or `-a` | (optional, use with -k) Address of private key to decrypt keystoreFile  |
| `--wait` or `-w` | (optional, default 360) The time to wait for a new provide in minutes |
| `--waitMarket` or `-m` | (optional, default 3) The time to wait to gather market data in minutes |
| `--network` or `-n` | (optional, default mainet) The ethereum network, ropsten option for test |

## Run project

There are three ways to load the wallet of the signer

### Load from private key

`$ node index.js -p 0x014c4c2e44c601bbe0f048dbd100f1e46243e566038020d55c2245ebc58f0f20`

## Load using file for private key

File format example:

```
module.exports = [
  "0x014c4c2e44c601bbe0f048dbd100f1e46243e566038020d55c2245ebc58f0f20"
]
```

`$ node index.js -f <filePkPath>`



## Run project using keystore-file for private key

You need to have geth (go-ethereum) previously installed to import account from private key and generate keystore-file.

Steps:

* Create a file with the private key in hex such as 0x126740... 
* Use the geth console to import account and set passphrase: 

```
$ geth account import ./key.prv
```

* This will create a keystore file with the privateKey encrypted in the Ethereum data directory (default: ~/.ethereum/keystore)

```
$ node index.js -a <address> -k <key>
```

## Run project using docker-compose 
You need to have docker and docker-compose previously installed:

Create a .env file with key-value pairs as follow:

* PRIVATE_KEY=<private_key>
* WAIT_TIME=<wait_time>
* WAIT_MARKET=<wait_market>
* NETWORK=<network>

```
$docker-compose build 
$docker-compose up 
```
