# FCL Dev-Wallet

A Flow wallet for development purposes.

## Introduction

The FCL `dev-wallet` is an `fcl` [(Flow client-library)](https://github.com/onflow-flow-js-sdk) compatible Flow wallet that simulates the protocols used by `fcl` to interact with the Flow blockchain on behalf of Flow accounts.

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
  -e FLOW_ACCOUNT_PRIVATE_KEY="" \
  -e FLOW_ACCOUNT_PUBLIC_KEY="" \
  -e FLOW_INIT_ACCOUNTS=0 \
  -e FLOW_ACCOUNT_ADDRESS=0xf8d6e0586b0a20c7 \
  -e FLOW_AVATAR_URL=https://avatars.onflow.org/avatar/ 
```
## Configuring Your Application

The FCL `dev-wallet` was designed to be used with FCL with a version of `0.0.68` or higher. `fcl` can be installed with: `npm install @onflow/fcl` or `yarn add @onflow/fcl`.


To use the dev-wallet, configure `fcl` to point to the address of a locally running [Flow emulator](#emulator), and the dev-wallet endpoint.

```javascript
import * as fcl from "@onflow/fcl"

// prettier-ignore
fcl.config()
  // Point App at Emulator
  .put("accessNode.api", "http://localhost:8080") 
  // Point FCL at dev-wallet (default port)
  .put("discovery.wallet", "http://localhost:8701/fcl/authn") 
```

### Emulator

The Flow Emulator simulates the real Flow network
for development purposes.

Start the emulator by running the following command in this directory:

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
