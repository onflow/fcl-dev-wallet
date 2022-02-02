import {WalletUtils} from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import {sign} from "src/crypto"
import {parseScopes} from "src/scopes"
import {buildServices} from "src/services"

const {serverRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {address, keyId} = req.body.service.data
  const {timestamp, appDomainTag} = req.body
  const scopes = new Set(parseScopes(req.body?.service?.params?.scopes))
  const signature = sign(
    serverRuntimeConfig.flowAccountPrivateKey,
    WalletUtils.encodeMessageForProvableAuthnSigning(
      address,
      timestamp,
      appDomainTag
    )
  )
  const compSig = new WalletUtils.CompositeSignature(address, keyId, signature)
  const services = buildServices({
    baseUrl: req.headers.origin || "",
    address,
    timestamp,
    scopes,
    compSig,
    appDomainTag,
    keyId,
  })

  const response = {
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    data: {
      f_type: "AuthnResponse",
      f_vsn: "1.0.0",
      addr: address,
      services,
    },
  }

  res.status(200).json(response)
}
