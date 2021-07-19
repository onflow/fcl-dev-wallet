import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {NextApiRequest, NextApiResponse} from "next"
import {authz} from "src/authz"
import config from "src/config"
import {FLOW_ENCODED_SERVICE_KEY} from "src/crypto"
import "src/fclConfig"
import FCLContract from "../../cadence/contracts/FCL.cdc"
import initTransaction from "../../cadence/transactions/init.cdc"

const init = async () => {
  try {
    const txId = await fcl
      .send([
        fcl.transaction(initTransaction),
        fcl.args([
          fcl.arg(Buffer.from(FCLContract, "utf8").toString("hex"), t.String),
          fcl.arg(FLOW_ENCODED_SERVICE_KEY, t.String),
          fcl.arg(config.flowInitAccountsNo, t.Int),
        ]),
        fcl.proposer(authz),
        fcl.payer(authz),
        fcl.authorizations([authz]),
        fcl.limit(200),
      ])
      .then(fcl.decode)
    // eslint-disable-next-line no-console
    console.log("TX", txId)
    const txStatus = await fcl.tx(txId).onceSealed()
    // eslint-disable-next-line no-console
    console.log("TX:SEALED", txStatus)

    fcl
      .account(config.flowAccountAddress)
      .then((d: {contracts: Record<string, unknown>}) => {
        // eslint-disable-next-line no-console
        console.log("ACCOUNT", Object.keys(d.contracts))
      })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("TX:ERROR", error)
  }
}

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  await init()

  res.status(200).json({
    foo: "bar",
  })
}
