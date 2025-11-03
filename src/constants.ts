export const FLOW_EVENT_TYPES = {
  accountCreated: "flow.AccountCreated",
}

export const LABEL_MISSING_ERROR = "Label is required."
export const SERVICE_ACCOUNT_LABEL = "Service Account"
export const UNTITLED_APP_NAME = "Untitled Dapp"

export const FLOW_TYPE = "FLOW"

export type TokenTypes = typeof FLOW_TYPE
export type TokenType = "FLOW"

// Chain IDs
export const CHAIN_ID_MAINNET = "mainnet"
export const CHAIN_ID_TESTNET = "testnet"
export const CHAIN_ID_EMULATOR = "emulator"

// Service account addresses per network
export const SERVICE_ACCOUNT_MAINNET = "0xe467b9dd11fa00df"
export const SERVICE_ACCOUNT_TESTNET = "0x8c5303eaa26202d6"

// Core contract addresses by network
export const FLOW_TOKEN_MAINNET = "0x1654653399040a61"
export const FLOW_TOKEN_TESTNET = "0x7e60df042a9c0868"
export const FLOW_TOKEN_EMULATOR = "0x0ae53cb6e3f42a79"

export const FUNGIBLE_TOKEN_MAINNET = "0xf233dcee88fe0abe"
export const FUNGIBLE_TOKEN_TESTNET = "0x9a0766d93b6608b7"
export const FUNGIBLE_TOKEN_EMULATOR = "0xee82856bf20e2aa6"

export const METADATA_VIEWS_MAINNET = "0x631e88ae7f1d7c20"
export const METADATA_VIEWS_TESTNET = "0x631e88ae7f1d7c20"
export const METADATA_VIEWS_EMULATOR = "0xf8d6e0586b0a20c7"

export const NON_FUNGIBLE_TOKEN_MAINNET = "0x1d7e57aa55817448"
export const NON_FUNGIBLE_TOKEN_TESTNET = "0x631e88ae7f1d7c20"
export const NON_FUNGIBLE_TOKEN_EMULATOR = "0xf8d6e0586b0a20c7"
