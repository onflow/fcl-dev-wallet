import "FCL"

transaction(address: Address, label: String, scopes: [String]) {
  prepare() {
    FCL.update(address: address, label: label, scopes: scopes)
  }
}
