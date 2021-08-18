import FCL from 0xSERVICE

transaction(label: String, scopes: [String]) {
  prepare() {
    FCL.new(label: label, scopes: scopes, address: nil)
  }
}
