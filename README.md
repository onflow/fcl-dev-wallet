# FCL Dev-Wallet

A Flow wallet for development purposes. To be used with the Flow Emulator.

## Introduction

The FCL `dev-wallet` is an `fcl` [(Flow client-library)](https://github.com/onflow-flow-js-sdk) compatible Flow wallet that simulates the protocols used by `@onflow/fcl` to interact with the Flow blockchain on behalf of Flow accounts.

**IMPORTANT**

```
This project implements an FCL compatible
interface, but should **not** be used as a reference for
building a production grade wallet.

This project should only be used in aid of local
development against a locally run instance of the Flow
blockchain like the Flow emulator, and should never be used in
conjunction with Flow Mainnet, Testnet, Canarynet or any
other instances of Flow.
```

## Getting Started

To use the dev-wallet simply start the service using Docker:

```bash
docker run ghcr.io/onflow/fcl-dev-wallet:latest
```

## Startup Options

The following startup options can be configured (defaults shown)

```bash
docker run ghcr.io/onflow/fcl-dev-wallet:latest \ 
  -e PORT=8701 \
  -e FLOW_ACCESS_NODE=http://emulator:8080 \
  -e FLOW_ACCOUNT_KEY_ID=0 \
  -e FLOW_ACCOUNT_PRIVATE_KEY=4f82df6790f07b281adb5bbc848bd6298a2de67f94bdfac7a400d5a1b893de5 \
  -e FLOW_ACCOUNT_PUBLIC_KEY=519e9fbf966c6589fafe60903c0da5f55c5cb50aee5d870f097b35dfb6de13c170718cd92f50811cdd9290e51c2766440b696e0423a5031ae482cca79e3c479 \
  -e FLOW_INIT_ACCOUNTS=0 \
  -e FLOW_ACCOUNT_ADDRESS=0xf8d6e0586b0a20c7 \ 
  -e FLOW_AVATAR_URL=https://avatars.onflow.org/avatar/ 
```

**Note:** The following variables should match the `emulator-account` defined in your project's `flow.json` file.
 For details about `flow.json` visit the `flow-cli` [configuration reference](https://docs.onflow.org/flow-cli/configuration/).

```
FLOW_ACCOUNT_PRIVATE_KEY
FLOW_ACCOUNT_PUBLIC_KEY
FLOW_ACCOUNT_ADDRESS
```
## Configuring Your Application

The FCL `dev-wallet` was designed to be used with [`@onflow/fcl`](https://github.com/onflow/flow-js-sdk) with a version of `0.0.68` or higher. `fcl` can be installed with: `npm install @onflow/fcl` or `yarn add @onflow/fcl`.


To use the dev-wallet, configure `fcl` to point to the address of a locally running [Flow emulator](#emulator), and the dev-wallet endpoint.

```javascript
import * as fcl from "@onflow/fcl"

fcl.config()
  // Point App at Emulator
  .put("accessNode.api", "http://localhost:8080") 
  // Point FCL at dev-wallet (default port)
  .put("discovery.wallet", "http://localhost:8701/fcl/authn") 
```

### Emulator


The Flow emulator simulates the real Flow network
for development purposes.

 - The emulator is part of the `flow-cli`. Instructions for installing the `flow-cli` can be found here: [https://docs.onflow.org/flow-cli/install/](https://docs.onflow.org/flow-cli/install/)

Start the emulator by running the following command from the directory containing `flow.json` in your project.

```sh
flow emulator start
```

Keep the emulator running; you'll need it!
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

You can now visit http://localhost:3001 to try out the dev-wallet.
