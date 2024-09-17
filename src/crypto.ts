import {ec as EC} from "elliptic"
import {SHA3} from "sha3"

export enum HashAlgorithm {
  SHA2_256 = 1,
  SHA2_384 = 2,
  SHA3_256 = 3,
  SHA3_384 = 4,
  KMAC128_BLS_BLS12_381 = 5,
  KECCAK_256 = 6,
}

export enum SignAlgorithm {
  ECDSA_P256 = 1,
  ECDSA_secp256k1 = 2,
  BLS_BLS12_381 = 3,
}

const ec = new EC("p256")

const hashMsgHex = (msgHex: string) => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
}

export function sign(privateKey: string, msgHex: string) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}
