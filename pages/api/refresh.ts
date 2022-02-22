import {WalletUtils} from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import {sign} from "src/crypto"
import {cors} from "src/middleware"
import {parseScopes} from "src/scopes"
import {buildServices} from "src/services"

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)
  const body = req.body
  const {timestamp, appDomainTag} = body
  const service = req.body?.service
  const address = service?.data?.address
  const keyId = service?.data?.keyId
  const scopes = new Set(parseScopes(service?.params?.scopes))
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
    baseUrl: publicRuntimeConfig.baseUrl,
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
