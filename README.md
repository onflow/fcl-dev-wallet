<br />
<p align="center">
  <a href="">
    <img src="./banner.svg" alt="Logo" width="600" height="auto">
  </a>

  <p align="center">
    <i>A Flow wallet for effortless development, to be used with the Flow Emulator and FCL.</i>
    <br />
    <a href="https://docs.onflow.org/fcl/"><strong>FCL docs»</strong></a>
    <br />
    <br />
    <a href="https://github.com/onflow/fcl-dev-wallet/issues">Report Bug</a>
    ·
    <a href="#getting-started">Getting Started</a>
  </p>
</p>
<br />
<br />

foo
## Introduction

The FCL dev wallet is a mock Flow wallet that simulates the protocols used by [FCL](https://docs.onflow.org/fcl/) to interact with the Flow blockchain on behalf of simulated user accounts.

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

## Getting started

Before using the dev wallet, you'll need to start the Flow emulator.

### Install the `flow-cli`

The Flow emulator is bundles with the Flow CLI. Instructions for installing the CLI can be found here: [https://docs.onflow.org/flow-cli/install/](https://docs.onflow.org/flow-cli/install/)

### Create a `flow.json` file

Run this command to create `flow.json` file (typically in your project's root directory):

```sh
flow init
```

### Start the emulator

Start the emulator and deploy the contracts by running the following command from the directory containing `flow.json` in your project:

```sh
flow emulator start
flow project deploy --network emulator
```

###  Start the dev wallet

You can run the dev wallet using its Docker image:

```sh
docker run ghcr.io/onflow/fcl-dev-wallet:latest
```

## All-in-one

You can run the dev-wallet + Flow emulator together using `docker-compose`:

```sh
docker-compose up -d
```

## Startup options

The following startup options can be configured (defaults shown). If you're using Docker Compose, these configuration values are defined in [`docker-compose.yml`](docker-compose.yml).

```sh
docker run -it \
    -p 8701:8701 \
    -e PORT=8701 \
    -e BASE_URL=http://localhost:8701 \
    -e FLOW_ACCESS_NODE=http://emulator:8080 \
    -e FLOW_ACCOUNT_KEY_ID=0 \
    -e FLOW_ACCOUNT_PRIVATE_KEY=4f82df6790f07b281adb5bbc848bd6298a2de67f94bdfac7a400d5a1b893de5 \
    -e FLOW_ACCOUNT_PUBLIC_KEY=519e9fbf966c6589fafe60903c0da5f55c5cb50aee5d870f097b35dfb6de13c170718cd92f50811cdd9290e51c2766440b696e0423a5031ae482cca79e3c479 \
    -e FLOW_INIT_ACCOUNTS=0 \
    -e FLOW_ACCOUNT_ADDRESS=0xf8d6e0586b0a20c7 \
    -e FLOW_AVATAR_URL=https://avatars.onflow.org/avatar/ \
    -e CONTRACT_FUNGIBLE_TOKEN=0xee82856bf20e2aa6 \
    -e CONTRACT_FLOW_TOKEN=0x0ae53cb6e3f42a79 \
    -e CONTRACT_FUSD=0xf8d6e0586b0a20c7 \
    -e TOKEN_AMOUNT_FLOW=100.0 \
    -e TOKEN_AMOUNT_FUSD=100.0 \
    ghcr.io/onflow/fcl-dev-wallet:latest  
```

**Note:** The following variables should match the `emulator-account` defined in your project's `flow.json` file.
 For details about `flow.json` visit the `flow-cli` [configuration reference](https://docs.onflow.org/flow-cli/configuration/).

```sh
FLOW_ACCOUNT_PRIVATE_KEY
FLOW_ACCOUNT_PUBLIC_KEY
FLOW_ACCOUNT_ADDRESS
```

## Configuring your JavaScript application

The FCL dev wallet is designed to be used with [`@onflow/fcl`](https://github.com/onflow/flow-js-sdk) version `0.0.68` or higher. The FCL package can be installed with: `npm install @onflow/fcl` or `yarn add @onflow/fcl`.

To use the dev wallet, configure FCL to point to the address of a locally running [Flow emulator](#start-the-emulator) and the dev wallet endpoint.

```javascript
import * as fcl from "@onflow/fcl"
import {send as grpcSend} from "@onflow/transport-grpc"

fcl.config()
  // Point App at Emulator
  .put("accessNode.api", "http://localhost:8080") 
  // Point FCL at dev-wallet (default port)
  .put("discovery.wallet", "http://localhost:8701/fcl/authn") 
  .put("sdk.transport", grpcSend)
```

### Test harness 

It's easy to use this FCL harness app as a barebones
app to interact with the dev-wallet during development:

Navigate to http://localhost:8701/harness

🚀
