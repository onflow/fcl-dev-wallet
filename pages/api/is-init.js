import "../../src/config"
import * as fcl from "@onflow/fcl"

const CODE = `
import FCL from 0xSERVICE

pub fun main(): Bool {
  return true 
}
`.trim()

export default async (req, res) => {
    
  try{

    var account = await fcl.send([fcl.getAccount(process.env.FLOW_ACCOUNT_ADDRESS)]).then(fcl.decode)
    if (account['contracts']['FCL']) {
        res.status(200).json(true)
    }
    else{
        res.status(200).json(true)
    }
  } catch (error) {
    res.status(200).json(false)
  }
}
