import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"

const CODE = `
  pub fun main(address: Address): PublicAccount {
    return getAccount(0xf8d6e0586b0a20c7)
  }
`.trim()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {address} = req.query
  try {
    const account = await fcl
      .send([fcl.script(CODE), fcl.args([fcl.arg(address, t.Address)])])
      .then(fcl.decode)
    res.status(200).json(account)
  } catch (_error) {
    res.status(500).json({})
  }
}
