import FCL from 0xSERVICE
import FlowToken from 0xFLOWTOKENADDRESS
import FungibleToken from 0xFUNGIBLETOKENADDRESS

/// This transaction creates a new account and funds it with
/// an initial balance of FLOW tokens.
///
transaction(label: String, scopes: [String], initialBalance: UFix64) {

  let tokenAdmin: &FlowToken.Administrator
  let tokenReceiver: &{FungibleToken.Receiver}

  prepare(signer: AuthAccount) {
    let account = FCL.new(label: label, scopes: scopes, address: nil)
  
    self.tokenAdmin = signer
		  .borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin)
      ?? panic("Signer is not the token admin")

		self.tokenReceiver = account
		  .getCapability(/public/flowTokenReceiver)!
		  .borrow<&{FungibleToken.Receiver}>()
      ?? panic("Unable to borrow receiver reference")
  }

  execute {
		let minter <- self.tokenAdmin.createNewMinter(allowedAmount: initialBalance)
		let mintedVault <- minter.mintTokens(amount: initialBalance)

		self.tokenReceiver.deposit(from: <- mintedVault)

		destroy minter
	}
}
