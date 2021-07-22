import {NewAccount} from "pages/api/accounts"

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

export const NEW_ACCOUNT: NewAccount = {
  type: "ACCOUNT",
  label: "",
  scopes: [],
}

export const FLOW_EVENT_TYPES = {
  accountCreated: "flow.AccountCreated",
}

export const LABEL_MISSING_ERROR = "Label is required."
