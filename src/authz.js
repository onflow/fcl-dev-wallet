import {sign} from "./crypto"
import * as fcl from "@onflow/fcl"

export async function authz(account) {
  return {
    ...account,
    // the tempId here in a very special and specific case.
    // what you are usually looking for in a tempId value is a unique string for the address and keyId as a pair
    // if you have no idea what this is doing, or what it does, or are getting an error in your own
    // implementation of an authorization function it is recommended that you use a string with the address and keyId in it.
    // something like... tempId: `${address}-${keyId}`
    tempId: "SERVICE_ACCOUNT",
    addr: fcl.sansPrefix(process.env.FLOW_ACCOUNT_ADDRESS), // eventually it wont matter if this address has a prefix or not, sadly :'( currently it does matter.
    keyId: Number(process.env.FLOW_ACCOUNT_KEY_ID),
    signingFunction: data => ({
      addr: fcl.withPrefix(process.env.FLOW_ACCOUNT_ADDRESS),
      keyId: Number(process.env.FLOW_ACCOUNT_KEY_ID),
      signature: sign(process.env.FLOW_ACCOUNT_PRIVATE_KEY, data.message),
    }),
  }
}
