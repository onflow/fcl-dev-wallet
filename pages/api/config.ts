import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"

export type ConfigResponse = {
  address?: string
  keyId?: string
  privateKey?: string
  accessNode?: string
}

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const response: ConfigResponse = {
    address: process.env.FLOW_ACCOUNT_ADDRESS,
    keyId: process.env.FLOW_ACCOUNT_KEY_ID,
    privateKey: process.env.FLOW_ACCOUNT_PRIVATE_KEY,
    accessNode: process.env.FLOW_ACCESS_NODE,
  }
  res.status(200).json(response)
}
