export const FLOW_EVENT_TYPES = {
  accountCreated: "flow.AccountCreated",
}

export const LABEL_MISSING_ERROR = "Label is required."
export const SERVICE_ACCOUNT_LABEL = "Service Account"
export const UNTITLED_APP_NAME = "Untitled Dapp"

export const FLOW_TYPE = "FLOW"
export const FUSD_TYPE = "FUSD"

export type TokenTypes = typeof FLOW_TYPE | typeof FUSD_TYPE
export type TokenType = "FLOW" | "FUSD"
