import * as fcl from "@onflow/fcl"
import {Account} from "pages/api/accounts"
import config from "./config"
import {sign} from "./crypto"
import publicConfig from "./publicConfig"

// alias Hex = String
// type signable = { message: Hex, voucher: voucher }
// type compositeSignature = { addr: String, keyId: Number, signature: Hex }
// signingFunction :: signable -> compositeSignature
// type account = { tempId: String, addr: String, keyId: Number, signingFunction: signingFunction }
// authz :: account -> account

export async function authz(account: Account) {
  return {
    // there is stuff in the account that is passed in
    // you need to make sure its part of what is returned
    ...account,
    // the tempId here is a very special and specific case.
    // what you are usually looking for in a tempId value is a unique string for the address and keyId as a pair
    // if you have no idea what this is doing, or what it does, or are getting an error in your own
    // implementation of an authorization function it is recommended that you use a string with the address and keyId in it.
    // something like... tempId: `${address}-${keyId}`
    tempId: "SERVICE_ACCOUNT",
    addr: fcl.sansPrefix(publicConfig.flowAccountAddress), // eventually it wont matter if this address has a prefix or not, sadly :'( currently it does matter.
    keyId: Number(config.flowAccountKeyId), // must be a number
    signingFunction: (signable: {message: string}) => ({
      addr: fcl.withPrefix(publicConfig.flowAccountAddress), // must match the address that requested the signature, but with a prefix
      keyId: Number(config.flowAccountKeyId), // must match the keyId in the account that requested the signature
      signature: sign(config.flowAccountPrivateKey, signable.message), // signable.message |> hexToBinArray |> hash |> sign |> binArrayToHex
      // if you arent in control of the transaction that is being signed we recommend constructing the
      // message from signable.voucher using the @onflow/encode module
    }),
  }
}
