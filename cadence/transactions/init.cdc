transaction(code: String, publicKey: String, hashAlgorithm: UInt8, signAlgorithm: UInt8, initAccountsLabels: [String]) {
  prepare(acct: auth(Contracts) &Account) {
    acct.contracts.add(name: "FCL", code: code.utf8, publicKey: publicKey, hashAlgorithm: hashAlgorithm, signAlgorithm: signAlgorithm, initAccountsLabels: initAccountsLabels)
  }
}
