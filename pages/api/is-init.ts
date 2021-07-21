import * as fcl from "@onflow/fcl"
import init from "cadence/scripts/init.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    await fcl.send([fcl.script(init)]).then(fcl.decode)
    res.status(200).json(true)
  } catch (error) {
    res.status(200).json(false)
  }
}
