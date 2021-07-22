import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"
import getAccount from "../../cadence/scripts/getAccount.cdc"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {address} = req.query
  try {
    const account = await fcl
      .send([fcl.script(getAccount), fcl.args([fcl.arg(address, t.Address)])])
      .then(fcl.decode)
    res.status(200).json(account)
  } catch (_error) {
    res.status(500).json({})
  }
}
