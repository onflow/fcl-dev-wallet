import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export type ConfigResponse = {
  address?: string
  keyId?: string
  privateKey?: string
  accessNode?: string
}

export default (_req: NextApiRequest, res: NextApiResponse) => {
  console.log(serverRuntimeConfig, publicRuntimeConfig)

  const response: ConfigResponse = {
    address: publicRuntimeConfig.flowAccountAddress,
    keyId: serverRuntimeConfig.flowAccountKeyId,
    privateKey: serverRuntimeConfig.flowAccountPrivateKey,
    accessNode: serverRuntimeConfig.flowAccessNode,
  }
  res.status(200).json(response)
}
