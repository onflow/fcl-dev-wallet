import {WalletUtils} from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import {sign} from "src/crypto"

const {serverRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {address, keyId, timestamp, appDomainTag} = req.body

  res.status(200).json({
    addr: address,
    keyId: keyId,
    signature: sign(
      serverRuntimeConfig.flowAccountPrivateKey,
      WalletUtils.encodeMessageForProvableAuthnSigning(
        address,
        timestamp,
        appDomainTag
      )
    ),
  })
}
