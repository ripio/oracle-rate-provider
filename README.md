# Oracle-rate-provider

## Run project using command arguments
To run this project, install it locally using npm:

Available init parameters in CLI:
* -p <private-key>  'Private key for the relayer such as 0x126740...' (required)
* -n <network> ' 'Ethereum Network ID - default: 1 (mainnet), 3 (ropsten)' 
* -w <wait> ' 'Wait time between each rate check (in secs) -  default: 45' 
* -mw <max-wait> ' 'Max wait time between each provide, forces a provide (in secs) -  default: 21600 (6 hours)'
* -c <currencies> ' 'List of currencies to provide, separated by commas'
* -oc <oracle-factory-contract> ' 'Oracle Factory contract address' 
* -uc <uniswap-factory-contract> ' 'Uniswap Factory contract address' 
* -t <percentage-threshold> ' 'Percentage delta required to update the rate' 
* -r <rpc> ' 'Ethereum RPC node URL' 

```
$ npm install
$ node index.js -p <private-key> -w <wait> -wm <max-wait> -n <network> ...

```

## Run project using docker-compose 
You need to have docker and docker-compose previously installed:

Create a .env file with key-value pairs as follow:

* RCNORACLE_PRIVATE_KEY==<private_key> (required)
* RCNORACLE_NETWORK=<network>
* RCNORACLE_WAIT=<wait>
* RCNORACLE_MAX_WAIT=<max-wait>
* RCNORACLE_CURRENCIES=<currencies>
* RCNORACLE_ORACLE_FACTORY_CONTRACT=<oracle-factory-contract>
* RCNORACLE_ORACLE_FACTORY_CONTRACT=<uniswap-factory-contract>
* RCNORACLE_PERCENTAGE_THRESHOLD=<percentage-threshold>
* RCNORACLE_RPC=<rpc>

```
$docker-compose build 
$docker-compose up 

```

## Run project using keystore-file for private key
You need to have geth (go-ethereum) previously installed to import account from private key and generate keystore-file.

Steps:
* Create a file with the private key in hex such as 0x126740... 
* Use the geth console to import account and set passphrase: 
```
$ geth account import ./key.prv
```
* This will create a keystore file with the privateKey encrypted in the Ethereum data directory (default: ~/.ethereum/keystore)

Next, to run this project, install it locally using npm:
Set the following arguments:

* -p <private-key>  'Private key for the relayer such as 0x126740...' (required)
* -f <private-key>  'File key for the relayer such as [0x126740...]' (required)
* -n <network> ' 'Ethereum Network ID - default: 1 (mainnet), 3 (ropsten)' 
* -w <wait> ' 'Wait time between each rate check (in secs) -  default: 45' 
* -mw <max-wait> ' 'Max wait time between each provide, forces a provide (in secs) -  default: 21600 (6 hours)'
* -a <address>  'address of keystoreFile' 
* -k <key> ' key passphrase to decrypt keystoreFile' 
* -c <currencies> ' 'List of currencies to provide, separated by commas'
* -oc <oracle-factory-contract> ' 'Oracle Factory contract address' 
* -uc <uniswap-factory-contract> ' 'Uniswap Factory contract address' 
* -t <percentage-threshold> ' 'Percentage delta required to update the rate' 
* -r <rpc> ' 'Ethereum RPC node URL' 


```
$ npm install
$ node index.js -a <address> -k <key> -w <wait> -m <waitMarket> -n <network>
```