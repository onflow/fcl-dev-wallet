import {NextApiRequest, NextApiResponse} from "next"
import config from "src/config"
import "src/fclConfig"
import publicConfig from "src/publicConfig"

export type ConfigResponse = {
  address?: string
  keyId?: string
  privateKey?: string
  accessNode?: string
}

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const response: ConfigResponse = {
    address: publicConfig.flowAccountAddress,
    keyId: config.flowAccountKeyId,
    privateKey: config.flowAccountPrivateKey,
    accessNode: config.flowAccessNode,
  }
  res.status(200).json(response)
}
