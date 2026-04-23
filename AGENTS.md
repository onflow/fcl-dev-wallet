# AGENTS.md

This file guides AI coding agents working in `fcl-dev-wallet`. Keep context-load cost low — edit in place; do not expand with speculation.

## Overview

`fcl-dev-wallet` is a mock Flow wallet that speaks the FCL authentication, authorization, and user-signature protocols against a locally running Flow emulator. The frontend is a Next.js 15 static-export app (TypeScript/React 18, theme-ui) in `pages/` + `components/`; the backend is a small Go HTTP server (`go/wallet/`, Go 1.18, gorilla/mux + cobra + viper) that embeds the built static bundle and serves a `/api` config endpoint. Target FCL is `@onflow/fcl` ^1.20.3. Emulator-only — never Mainnet, Testnet, or Canarynet (see README warning).

## Build and Test Commands

Node toolchain (CI uses Node 20 — `.github/workflows/ci.yml`):

- `npm run dev` — Next on port 8701 (`APP_ENV=local`) + Go API on port 8799, via `concurrently` (package.json)
- `npm run build` — `next build` (produces a static export; `next.config.js` sets `output: "export"`)
- `npm run start` — `next start` + Go API on 8799
- `npm run lint` / `npm run lint:fix` — ESLint (`.eslintrc.json`)
- `npm run tsc` — typecheck via local TypeScript (`tsconfig.json`, `strict: true`)
- `npm run check` — `eslint . && npm run tsc` (what CI effectively runs)
- `npm test` — Cypress E2E (`cypress run`; `cypress.json` `baseUrl: http://localhost:3000/harness`)

Go-embedded bundle workflow (see `go/README.md`):

- `npm run bundle` — alias for `next build`
- `npm run zip` — zip `./out` into `./go/wallet/bundle.zip`
- `npm run config` — copy `.env.development` to `./go/wallet/`
- `npm run go-server` — bundle + zip + config + `go run ./go/wallet/cmd/main.go` (default port 8701; `main.go` exposes `--port`)

## Architecture

```
pages/                 Next pages router: index.tsx, _app.tsx, fcl/{authn,authn-refresh,authz,user-sig}.tsx
components/            React UI (Account*, Authn*, Authz*, Dialog, Inputs, Spinner, Switch, etc.)
contexts/              React contexts: Authn, AuthnRefresh, Authz, Config
hooks/                 useAccount(s), useAuthn*/Authz*Context, useConfig, useFclData, useVariants, useThemeUI
src/                   FCL/Flow glue: fclConfig.ts, accounts.ts, accountAuth.ts, authz.ts, crypto.ts,
                       services.ts, scopes.ts, cadence.ts, init.ts, middleware.ts, safe.ts, validate.ts
src/harness/           Minimal FCL test harness served at /harness (cmds/*.js, hooks/*.js)
cadence/contracts/     FCL.cdc, FCLCrypto.cdc + utility contracts (FlowToken, FungibleToken,
                       FungibleTokenMetadataViews, MetadataViews, NonFungibleToken, ViewResolver)
cadence/scripts/       getAccount.cdc, getAccounts.cdc
cadence/transactions/  addAccount.cdc, fundFLOW.cdc, init.cdc, newAccount.cdc, updateAccount.cdc
go/wallet/             HTTP server embedding the built bundle: server.go, {config,dev_wallet,discovery,
                       polling_session,service}_handler.go, util.go; entry go/wallet/cmd/main.go
cypress/integration/   authn.spec.js, authz.spec.js
flow.json              FCL + FCLCrypto contract aliases (emulator/testnet/mainnet) and deployments
```

`next.config.js` key pieces: `output: "export"` (static site), rewrites `/api/:path*` → `http://localhost:8799/api/:path*`, webpack rule importing `.cdc` files as `asset/source` (consumed by `src/cadence.ts`), and an `env` map exposing `FLOW_*` variables listed in `.env.example`.

## Conventions and Gotchas

- **Emulator only.** README explicitly warns against Mainnet/Testnet/Canarynet. "Fork Mode" (README) auto-enables when the access node is mainnet/testnet and assumes signature validation is disabled on the network — it is for forked-emulator testing, not production.
- **Two processes, two ports.** `npm run dev` runs Next on `8701` and the Go API on `8799`; the Next rewrite forwards `/api/*` to `8799`, so both must be up. When running the Go-embedded bundle (`npm run go-server`), the Go server alone serves the static bundle and API on port `8701` (default in `go/wallet/cmd/main.go`).
- **FCL endpoint is `http://localhost:8701/fcl/authn`.** Consumers set `accessNode.api` → `http://localhost:8888` (emulator REST) and `discovery.wallet` → that URL (README).
- **Emulator service account is wired in `.env.example`.** `FLOW_ACCOUNT_ADDRESS=0xf8d6e0586b0a20c7` must match the `emulator-account` in the consuming project's `flow.json`. `FLOW_INIT_ACCOUNTS` sets the initial accounts count (see `.env.example`).
- **Cadence is imported as source text.** `.cdc` files are loaded via the webpack `asset/source` rule; edits to contracts/transactions/scripts take effect on next build. Contract aliases live in `flow.json` (FCL emulator `f8d6e0586b0a20c7`; FCLCrypto emulator `b4b82a1c9d21d284`).
- **Config precedence in the Go library** (`go/README.md`): values passed into `wallet.NewHTTPServer` override `.env.development`, but only for `flowAccountAddress`, `flowAccountPrivateKey`, `flowAccountPublicKey`, `flowAccessNode`. Env vars are snake_case → camelCase when exposed via `/api`.
- **Run `npm run config` after editing `.env.development`.** The Go server reads `./go/wallet/.env.development`, not the repo root. `npm run go-server` chains this step automatically.
- **CI runs only `npm run lint` and `npm run tsc`** (`.github/workflows/ci.yml`, Node 20.x). Cypress is not wired into CI; run `npm test` locally against a running dev server. Note `cypress.json` `baseUrl` is port `3000`, not the dev wallet's `8701` — verify before running.
- **Prettier style: no semis, no bracket spacing, ES5 trailing commas, arrow-parens avoid** (`.prettierrc`). TS is `strict: true` with `noUnusedLocals` and `noImplicitReturns` (`tsconfig.json`).
- **`src/**` changes on `main` trigger `.github/workflows/build-bundle.yml`**, which rebuilds `go/wallet/bundle.zip` and opens an auto-PR. Do not hand-edit `go/wallet/bundle.zip`.

## Files Not to Modify

- `go/wallet/bundle.zip` — regenerated by `build-bundle.yml` from `out/`
- `package-lock.json`, `go.sum` — dependency lockfiles
- `imports/` — resolved contract copies keyed by network account address
- `next-env.d.ts` — managed by Next.js
