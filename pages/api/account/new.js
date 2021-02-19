import "../../../src/config"
import * as fcl from "@onflow/fcl"
import {authz} from "../../../src/authz"

const CODE = `
import FCL from 0xSERVICE

transaction {
  prepare() {
    FCL.new()
  }
}
`.trim()

export default async (req, res) => {
  try {
    console.log("Creating Account")
    var txId = await fcl
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
    console.error("ISSUE CREATING ACCOUNT", error)
  }
}
