import FUSD from 0xFUSDADDRESS
import FungibleToken from 0xFUNGIBLETOKENADDRESS

transaction(code: String, key: String, initAccountsLabels: [String]) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "FCL", code: code.decodeHex(), key: key, initAccountsLabels: initAccountsLabels)
  }
}
