## Dev Wallet Go Library
The FCL dev wallet is being integrated into the Flow CLI and since the FCL Dev Wallet is a 
software written in javascript/typescript it introduces this Go wrapper, that embeds 
the statically built bundle of the FCL Dev Wallet app and serves it with the implemented 
Go HTTP server.

It also introduces a config API endpoint `/api` that serves the configuration needed by the 
statically built bundle during the runtime. This Go library gets the configuration from 
two sources:
- From the configuration passed to the library 
- From the `.env.development` file

The configuration that is being passed to the library will overwrite the configuration 
in the `.env.development` but it's only limited to providing values for the following keys:
- `flowAccountAddress`
- `flowAccountPrivateKey`
- `flowAccountPublicKey`
- `flowAccessNode`

The configuration that is fetched from the `.env.development` file will be converted from 
snake case to camel case. Example a property named `FOO_BAR_ZOO` wil become `fooBarZoo` 
when server with the API configuration endpoint.

Configuration is dynamically built, so even if new values are added there is no change 
required in the Go implementation, beside just building the bundle and releasing a new version 
on the Github.

### Testing
During the development of Dev wallet you can test how the Go library works by running:
```
npm run go-server
```
This command will build the latest bundle, copy the `.env.development` from the root 
directory in the `/go/wallet` (just to make sure they are in sync), build the Go server and 
run it. **You must make sure you have Go installed**, here are instructions: https://go.dev/doc/install
