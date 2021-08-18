import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"
import publicConfig from "src/publicConfig"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const account = await fcl
      .send([fcl.getAccount(publicConfig.flowAccountAddress)])
      .then(fcl.decode)
    if (account["contracts"]["FCL"]) {
      res.status(200).json(true)
    } else {
      res.status(200).json(false)
    }
  } catch (error) {
    res.status(200).json(false)
  }
}
