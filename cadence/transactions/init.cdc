transaction(code: String, key: String, initAccountsLabels: [String]) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "FCL", code: code.utf8, key: key, initAccountsLabels: initAccountsLabels)
  }
}
