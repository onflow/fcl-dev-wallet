import FCL from 0xSERVICE

transaction(address: Address, label: String, scopes: [String]) {
  prepare() {
    FCL.update(address: address, label: label, scopes: scopes)
  }
}
