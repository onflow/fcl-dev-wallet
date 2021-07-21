import "../../src/config"
import * as fcl from "@onflow/fcl"

const SERVICE_ACCOUNT = {
  type: "ACCOUNT",
  address: process.env.FLOW_ACCOUNT_ADDRESS,
  keyId: process.env.FLOW_ACCOUNT_KEY_ID,
  label: "Service Account",
}

const CODE = `
import FCL from 0xSERVICE

pub fun main(): [FCL.Account] {
  return FCL.accounts().values
}
`.trim()

export default async (req, res) => {
  try {
       var fcl_contract = await fcl.send([fcl.getAccount(process.env.FLOW_ACCOUNT_ADDRESS)]).then(fcl.decode)['contracts']['FCL']
    if (fcl_contract) {
      var accounts = await fcl.send([fcl.script(CODE)]).then(fcl.decode)
        res.status(200).json([SERVICE_ACCOUNT, ...accounts])
    }
    else{
      res.status(200).json([SERVICE_ACCOUNT])
    }
  } catch (_error) {
    res.status(200).json([SERVICE_ACCOUNT])
  }
}
