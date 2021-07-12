import {NextApiRequest, NextApiResponse} from "next"
import config from "src/config"
import "src/fclConfig"

export type ConfigResponse = {
  address?: string
  keyId?: string
  privateKey?: string
  accessNode?: string
}

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const response: ConfigResponse = {
    address: config.flowAccountAddress,
    keyId: config.flowAccountKeyId,
    privateKey: config.flowAccountPrivateKey,
    accessNode: config.flowAccessNode,
  }
  res.status(200).json(response)
}
