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

// Service account addresses per network (for fork mode detection)
export const SERVICE_ACCOUNT_MAINNET = "0xe467b9dd11fa00df"
export const SERVICE_ACCOUNT_TESTNET = "0x8c5303eaa26202d6"
