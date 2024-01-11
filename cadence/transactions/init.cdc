transaction(code: String, key: String, initAccountsLabels: [String]) {
  prepare(acct: auth(Contracts) &Account) {
    acct.contracts.add(name: "FCL", code: code.utf8, key: key, initAccountsLabels: initAccountsLabels)
  }
}
