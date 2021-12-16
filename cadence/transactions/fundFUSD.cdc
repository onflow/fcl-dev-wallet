import FUSD from 0xFUSDADDRESS
import FungibleToken from 0xFUNGIBLETOKENADDRESS

pub fun hasFUSD(_ address: Address): Bool {
  let receiver = getAccount(address)
    .getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)
    .check()

  let balance = getAccount(address)
    .getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance)
    .check()

  return receiver && balance
}

pub fun initFUSD(_ acct: AuthAccount) {
  if acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
    acct.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)
  }
  acct.unlink(/public/fusdReceiver)
  acct.unlink(/public/fusdBalance)
  acct.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
  acct.link<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance, target: /storage/fusdVault)
}

transaction(address: Address, amount: UFix64) {
  let tokenAdmin: &FUSD.Administrator
  let tokenReceiver: &{FungibleToken.Receiver}

  prepare(minterAccount: AuthAccount, receiverAccount: AuthAccount) {
    if !hasFUSD(receiverAccount.address) {
      initFUSD(receiverAccount)
    }

    self.tokenAdmin = minterAccount
      .borrow<&FUSD.Administrator>(from: FUSD.AdminStoragePath)
        ?? panic("minterAccount is not the token admin")

    self.tokenReceiver = getAccount(address)
      .getCapability(/public/fusdReceiver)!
      .borrow<&{FungibleToken.Receiver}>()
      ?? panic("Unable to borrow receiver reference")
  }

  execute {
    let minter <- self.tokenAdmin.createNewMinter()
    let mintedVault <- minter.mintTokens(amount: amount)

    self.tokenReceiver.deposit(from: <-mintedVault)
    destroy minter
  }
}
