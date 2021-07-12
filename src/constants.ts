export const paths = {
  root: "/",
  apiInit: "/api/init",
  apiIsInit: "/api/is-init",
  apiAccount: (address: string) => `/api/accounts/${address}`,
  apiAccounts: "/api/accounts",
  apiAccountsNew: "/api/accounts/new",
  apiConfig: "/api/config",
  apiSign: "/api/sign",
  userSig: "/api/user-sig",
}
