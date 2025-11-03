import FCL from 0xFCL

transaction(address: Address, label: String, scopes: [String]) {
  prepare(acct: &Account) {
    FCL.add(address: address, label: label, scopes: scopes)
  }
}

