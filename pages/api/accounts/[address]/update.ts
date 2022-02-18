import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import updateAccountTransaction from "cadence/transactions/updateAccount.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import {authz} from "src/authz"
import fclConfig from "src/fclConfig"

const {publicRuntimeConfig, publicRuntimeConfig} = getConfig()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {label, scopes} = req.body
  const address = fcl.withPrefix(req.body.address)

  fclConfig(
    publicRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  const authorization = await authz(
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.flowAccountKeyId,
    publicRuntimeConfig.flowAccountPrivateKey
  )

  try {
    const txId = await fcl
      .send([
        fcl.transaction(updateAccountTransaction),
        fcl.args([
          fcl.arg(address, t.Address),
          fcl.arg(label, t.String),
          fcl.arg(scopes, t.Array(t.String)),
        ]),
        fcl.proposer(authorization),
        fcl.payer(authorization),
        fcl.limit(100),
      ])
      .then(fcl.decode)

    await fcl.tx(txId).onceSealed()

    res.status(200).json({})
  } catch (_error) {
    res.status(500).json({errors: "Account update failed."})
  }
}
