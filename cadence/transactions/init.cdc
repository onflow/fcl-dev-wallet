transaction(code: String, key: String, initAccountsLabels: [String]) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "FCL", code: code.decodeHex(), key: key, initAccountsLabels: initAccountsLabels)
  }
}
