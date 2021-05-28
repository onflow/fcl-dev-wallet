# FCL Dev Wallet

**IMPORTANT**

```
The FCL Dev Wallet is currently in active development and
it's current state should be considered as a preview.

If you encounter any problems please make sure you are
using an up-to-date copy and if the issue persists please
let us know by creating an issue.

This project, while it does implement an FCL compatible
interface, it should not be used as a reference for
building a production grade wallet, especially the way it
handles account creation and private keys.

This project should only be used in aid of local
development against a locally run instance of the Flow
blockchain like the emulator, and should never be used in
conjunction with Flow Mainnet, Testnet, Canarynet or any
other instances of Flow you are not in complete control
of and have isolated from the rest of the internet.
```

## Getting Started

```bash
git clone https://github.com/onflow/fcl-dev-wallet.git
cd fcl-dev-wallet
cp .env.example .env.local

# UPDATE THE VALUES IN .env.local TO MATCH YOUR ENVIRONMENT

npm install
npm run dev
```

> **NOTE:** you can change the port the dev wallet runs on with `npm run dev -- -p 9999`

## Configuring Your Application

The FCL Dev Wallet was designed to be used with FCL with a version of `0.0.68` or higher.
Currently `fcl@0.0.68` is in alpha an can be installed with: `npm install @onflow/fcl@alpha` or `yarn add @onflow/fcl@alpha`.

```javascript
import * as fcl from "@onflow/fcl"

// prettier-ignore
fcl.config()
  // Point App at Emulator
  .put("accessNode.api", "http://localhost:8080")
  // Point FCL Wallet Discovuer at Dev Wallet
  .put("discovery.wallet", "http://localhost:3000/fcl/authn") // with default port configuration
```

### Emulator

The Flow Emulator simulates the real Flow network
for development purposes. 

Start the emulator by running the following command in this directory:

```sh
flow emulator start
```

Keep the emulator running; you'll need it!


### Dev wallet

Once the harness is running, 
clone this repository and start the dev wallet:

```sh
cd fcl-dev-wallet
cp .env.example .env.local

npm install
npm run dev
```

Keep the wallet running, too!

### Harness

It's easy to use this FCL harness app as a barebones 
app to interact with the dev wallet during development: 
https://github.com/orodio/harness

```sh
git clone https://github.com/orodio/harness.git

cd harness
npm install
PORT=3001 npm run start
```

You can now visit http://localhost:3001 to try out the dev wallet.