import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import getAccount from "cadence/scripts/getAccount.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import fclConfig from "src/fclConfig"
import getConfig from "next/config"

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {address} = req.query

  fclConfig(
    serverRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.flowAccountAddress
  )

  try {
    const account = await fcl
      .send([fcl.script(getAccount), fcl.args([fcl.arg(address, t.Address)])])
      .then(fcl.decode)
    res.status(200).json(account)
  } catch (_error) {
    res.status(500).json({})
  }
}
