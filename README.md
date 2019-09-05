# oracle-rate-provider

## Run project using command arguments
To run this project, install it locally using npm:

Set the following arguments:

* -p <pk>  'private keys'
* -w <wait> ' 'The time to wait for a new provide' 

```
$ npm install
$ node index.js -p <pk> -w <wait> 

```

## Run project using file for private key
To run this project, install it locally using npm:

Set the following arguments:

* -f <filePk>  'private keys'
* -w <wait> ' 'The time to wait for a new provide' 

```
$ npm install
$ node index.js -f <path> -w <wait> 

```

## Run project using docker-compose 
You need to have docker and docker-compose previously installed:

Create a .env file with key-value pairs as follow:

* PRIVATE_KEY=<private_key>
* WAIT_TIME=<wait_time>

```
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

* -a <address>  'address of private key to decrypt keystoreFile'
* -k <key> ' key passphrase to decrypt keystoreFile' 

```
$ npm install
$ node index.js -a <address> -k <key> 
```