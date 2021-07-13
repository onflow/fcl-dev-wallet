import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import {authz} from "src/authz"
import "src/fclConfig"

const CODE = `
import FCL from 0xSERVICE

transaction {
  prepare() {
    FCL.new()
  }
}
`.trim()

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // eslint-disable-next-line no-console
    console.log("Creating Account")
    const txId = await fcl
      .send([
        fcl.transaction(CODE),
        fcl.proposer(authz),
        fcl.payer(authz),
        fcl.limit(20),
      ])
      .then(fcl.decode)

    await fcl.tx(txId).onceSealed()
    res.status(200).json(true)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("ISSUE CREATING ACCOUNT", error)
  }
}
