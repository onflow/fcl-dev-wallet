import FungibleToken from 0xFUNGIBLETOKENADDRESS

pub fun main(addr: Address): UFix64 {
  return getAccount(addr)
    .getCapability<&{FungibleToken.Balance}>(/public/fusdBalance)
    .borrow()?.balance ?? 0.0
}
