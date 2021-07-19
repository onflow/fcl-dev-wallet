transaction(code: String, key: String, initAccountsNo: Int) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "FCL", code: code.decodeHex(), key: key, initAccountsNo: initAccountsNo)
  }
}
