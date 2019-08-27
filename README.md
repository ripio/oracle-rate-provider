# oracle-rate-provider

## Run project using command arguments
To run this project, install it locally using npm:

Set the following arguments:
     -p <pk>  'private keys'
     -w <wait> ' 'The time to wait for a new provide' 
```
$ npm install
$ node index.js -p <pk> -w <wait> 

```

## Run project using file for private key
To run this project, install it locally using npm:

Set the following arguments:
     -f <filePk>  'private keys'
     -w <wait> ' 'The time to wait for a new provide' 
```
$ npm install
$ node index.js -f <path> -w <wait> 

```

## Run project using docker-compose 
To run this project, you need to have docker and docker-compose installed:

Create a .env file with key-value pairs as follow:
    PRIVATE_KEY=<private_key>
    WAIT_TIME=<wait_time>

```
$docker-compose up 

```