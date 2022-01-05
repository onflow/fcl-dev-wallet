export const paths = {
  root: "/",
  apiInit: "/api/init",
  apiIsInit: "/api/is-init",
  apiAccount: (address: string) => `/api/accounts/${address}`,
  apiAccountUpdate: (address: string) => `/api/accounts/${address}/update`,
  apiAccountFund: (address: string) => `/api/accounts/${address}/fund`,
  apiAccountFUSDBalance: (address: string) =>
    `/api/accounts/${address}/fusdBalance`,
  apiAccountFlowBalance: (address: string) =>
    `/api/accounts/${address}/flowBalance`,
  apiAccounts: "/api/accounts",
  apiAccountsNew: "/api/accounts/new",
  apiConfig: "/api/config",
  apiSign: "/api/sign",
  userSig: "/api/user-sig",
  proveAuthn: "/api/prove-authn",
  authnRefresh: "/api/refresh",
}

export const FLOW_EVENT_TYPES = {
  accountCreated: "flow.AccountCreated",
}

export const LABEL_MISSING_ERROR = "Label is required."
export const SERVICE_ACCOUNT_LABEL = "Service Account"
export const UNTITLED_APP_NAME = "Untitled Dapp"

export const FLOW_TYPE = "FLOW"
export const FUSD_TYPE = "FUSD"

export const MISSING_FUSD_VAULT_ERROR =
  "This account does not have an FUSD vault"

export type TokenTypes = typeof FLOW_TYPE | typeof FUSD_TYPE
export type TokenType = "FLOW" | "FUSD"
