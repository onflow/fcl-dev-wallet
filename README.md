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

This project should only be used in aide of local
development against a locally run instance of the Flow
Blockchain like the emulator, and should never be used in
conjunction with Flow Mainnet, Testnet, Canarynet or any
other instances of Flow you are not in complete control
of and have isolated from the rest of the internet.
```

## Getting Started

```bash
git clone git@github.com:onflow/fcl-dev-wallet.git
cd fcl-dev-wallet
cp .env.example .env.local

# UPDATE THE VALUES IN .env.local TO MATCH YOUR ENVIRONMENT

npm install
npm run dev
```

> **NOTE:** you can change the port the dev wallet runs on with `npm run dev -- -p 9999`
