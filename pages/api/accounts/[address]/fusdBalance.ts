import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import getFUSDBalanceScript from "cadence/scripts/getFUSDBalance.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import fclConfig from "src/fclConfig"

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {address} = req.query

  fclConfig(
    serverRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  try {
    const balance = await fcl
      .send([
        fcl.script(getFUSDBalanceScript),
        fcl.args([fcl.arg(address, t.Address)]),
      ])
      .then(fcl.decode)
    res.status(200).json(balance)
  } catch (_error) {
    res.status(500).json({})
  }
}
