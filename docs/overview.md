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
 
