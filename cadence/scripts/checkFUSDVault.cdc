  import FUSD from 0xFUSDADDRESS
  import FungibleToken from 0xFUNGIBLETOKENADDRESS

  pub fun main(address: Address): Bool {
    let receiver = getAccount(address)
      .getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)
      .check()
    let balance = getAccount(address)
      .getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance)
      .check()
    return receiver && balance
  }
