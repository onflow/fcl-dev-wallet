export const paths = {
  root: "/",
  apiInit: "/api/init",
  apiIsInit: "/api/is-init",
  apiAccount: (address: string) => `/api/accounts/${address}`,
  apiAccountUpdate: (address: string) => `/api/accounts/${address}/update`,
  apiAccounts: "/api/accounts",
  apiAccountsNew: "/api/accounts/new",
  apiConfig: "/api/config",
  apiSign: "/api/sign",
  userSig: "/api/user-sig",
}

export const FLOW_EVENT_TYPES = {
  accountCreated: "flow.AccountCreated",
}

export const LABEL_MISSING_ERROR = "Label is required."
export const SERVICE_ACCOUNT_LABEL = "Service Account"
export const UNTITLED_APP_NAME = "Untitled"
