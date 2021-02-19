import "../../src/config"
import * as fcl from "@onflow/fcl"

const CODE = `
import FCL from 0xSERVICE

pub fun main(): Bool {
  return true 
}
`.trim()

export default async (req, res) => {
  try {
    await fcl.send([fcl.script(CODE)]).then(fcl.decode)
    res.status(200).json(true)
  } catch (error) {
    res.status(200).json(false)
  }
}
