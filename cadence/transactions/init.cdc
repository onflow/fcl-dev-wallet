import FUSD from 0xFUSDADDRESS
import FungibleToken from 0xFUNGIBLETOKENADDRESS

pub fun initFUSD(_ acct: AuthAccount) {
  if acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
    acct.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)
  }
  acct.unlink(/public/fusdReceiver)
  acct.unlink(/public/fusdBalance)
  acct.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
  acct.link<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance, target: /storage/fusdVault)
}

transaction(code: String, key: String, initAccountsLabels: [String]) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "FCL", code: code.decodeHex(), key: key, initAccountsLabels: initAccountsLabels)
    initFUSD(acct)
  }
}
