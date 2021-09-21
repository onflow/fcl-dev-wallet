import {NextApiRequest, NextApiResponse} from "next"
import {sign} from "src/crypto"
import getConfig from "next/config"

const {serverRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    message,
    data: {addr, keyId, timestamp},
  } = req.body

  const rightPaddedHexBuffer = (value: string, pad: number) =>
    Buffer.from(value.padEnd(pad * 2, "0"), "hex")

  const USER_DOMAIN_TAG = rightPaddedHexBuffer(
    Buffer.from("FLOW-V0.0-user").toString("hex"),
    32
  ).toString("hex")

  const prependUserDomainTag = (msg: string) => USER_DOMAIN_TAG + msg

  res.status(200).json({
    addr: addr,
    keyId: keyId,
    signature: sign(
      serverRuntimeConfig.flowAccountPrivateKey,
      prependUserDomainTag(message)
    ),
  })
}
