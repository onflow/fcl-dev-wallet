var EC = require("elliptic").ec
var SHA3 = require("sha3").SHA3
const ec = new EC("p256")

const hashMsgHex = msgHex => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, "hex"))
  return sha.digest()
}

const sign = (privateKey, msgHex) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

export default (req, res) => {
  const {message} = req.body
  res
    .status(200)
    .json({signature: sign(process.env.FLOW_ACCOUNT_PRIVATE_KEY, message)})
}
