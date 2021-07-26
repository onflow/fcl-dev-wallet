import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const account = await fcl
      .send([fcl.getAccount(process.env.FLOW_ACCOUNT_ADDRESS)])
      .then(fcl.decode)
    if (account["contracts"]["FCL"]) {
      res.status(200).json(true)
    } else {
      res.status(200).json(true)
    }
  } catch (error) {
    res.status(200).json(false)
  }
}
