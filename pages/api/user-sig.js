import "../../src/config"
import {sign} from "../../src/crypto"

export default async (req, res) => {
  const {
    message,
    data: {addr, keyId},
  } = req.body

  // UserDomainTag is the prefix of all signed user space payloads.
  //
  // A domain tag is encoded as UTF-8 bytes, right padded to a total length of 32 bytes.
  const rightPaddedHexBuffer = (value, pad) =>
    Buffer.from(value.padEnd(pad * 2, 0), "hex")

  const USER_DOMAIN_TAG = rightPaddedHexBuffer(
    Buffer.from("FLOW-V0.0-user").toString("hex"),
    32
  ).toString("hex")

  const prependUserDomainTag = msg => USER_DOMAIN_TAG + msg

  res.status(200).json({
    addr: addr,
    keyId: keyId,
    signature: sign(
      process.env.FLOW_ACCOUNT_PRIVATE_KEY,
      prependUserDomainTag(message)
    ),
  })
}
