import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import updateAccountTransaction from "cadence/transactions/updateAccount.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import {authz} from "src/authz"
import "src/fclConfig"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {label, scopes} = req.body
  const address = fcl.withPrefix(req.body.address)

  try {
    const txId = await fcl
      .send([
        fcl.transaction(updateAccountTransaction),
        fcl.args([
          fcl.arg(address, t.Address),
          fcl.arg(label, t.String),
          fcl.arg(scopes, t.Array(t.String)),
        ]),
        fcl.proposer(authz),
        fcl.payer(authz),
        fcl.limit(100),
      ])
      .then(fcl.decode)

    const txStatus = await fcl.tx(txId).onceSealed()
    // eslint-disable-next-line no-console
    console.log("TX:SEALED", txStatus)

    res.status(200).json({})
  } catch (_error) {
    res.status(500).json({errors: "Account update failed."})
  }
}
