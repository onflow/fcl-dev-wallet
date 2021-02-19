var EC = require("elliptic").ec
var SHA3 = require("sha3").SHA3
const ec = new EC("p256")

import {encodeKey, ECDSA_P256, SHA3_256} from "@onflow/util-encode-key"

export const FLOW_ENCODED_SERVICE_KEY = encodeKey(
  process.env.FLOW_ACCOUNT_PUBLIC_KEY,
  ECDSA_P256,
  SHA3_256,
  1000
)

const hashMsgHex = msgHex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
}

export function sign(privateKey, msgHex) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}
