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

### Start the dev wallet

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
    -e FLOW_ACCESS_NODE=http://emulator:8888 \
    -e FLOW_ACCOUNT_KEY_ID=0 \
    -e FLOW_ACCOUNT_PRIVATE_KEY=f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5 \
    -e FLOW_ACCOUNT_PUBLIC_KEY=6e70492cb4ec2a6013e916114bc8bf6496f3335562f315e18b085c19da659bdfd88979a5904ae8bd9b4fd52a07fc759bad9551c04f289210784e7b08980516d2 \
    -e FLOW_INIT_ACCOUNTS=0 \
    -e FLOW_ACCOUNT_ADDRESS=0xf8d6e0586b0a20c7 \
    -e FLOW_AVATAR_URL=https://avatars.onflow.org/avatar/ \
    -e CONTRACT_FUNGIBLE_TOKEN=0xee82856bf20e2aa6 \
    -e CONTRACT_FLOW_TOKEN=0x0ae53cb6e3f42a79 \
    -e CONTRACT_FUSD=0xf8d6e0586b0a20c7 \
    -e CONTRACT_FCL_CRYPTO=0x74daa6f9c7ef24b1 \
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

The FCL dev wallet is designed to be used with [`@onflow/fcl`](https://github.com/onflow/flow-js-sdk) version `1.0.0` or higher. The FCL package can be installed with: `npm install @onflow/fcl` or `yarn add @onflow/fcl`.

To use the dev wallet, configure FCL to point to the address of a locally running [Flow emulator](#start-the-emulator) and the dev wallet endpoint.

```javascript
import * as fcl from "@onflow/fcl"

fcl
  .config()
  // Point App at Emulator REST API
  .put("accessNode.api", "http://localhost:8888")
  // Point FCL at dev-wallet (default port)
  .put("discovery.wallet", "http://localhost:8701/fcl/authn")
```

### Test harness

It's easy to use this FCL harness app as a barebones
app to interact with the dev-wallet during development:

Navigate to http://localhost:8701/harness

## Contributing
Releasing a new version of Dev Wallet is as simple as tagging and creating a release, a Github Action will then build a bundle of the Dev Wallet that can be used in other tools (such as CLI). If the update of the Dev Wallet is required in the CLI, a seperate update PR on the CLI should be created.
 
