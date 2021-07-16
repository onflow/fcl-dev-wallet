import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"
import init from "../../cadence/scripts/init.cdc"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    await fcl.send([fcl.script(init)]).then(fcl.decode)
    res.status(200).json(true)
  } catch (error) {
    res.status(200).json(false)
  }
}
