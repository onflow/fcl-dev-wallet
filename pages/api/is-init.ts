import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"

const CODE = `
import FCL from 0xSERVICE

pub fun main(): Bool {
  return true
}
`.trim()

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    await fcl.send([fcl.script(CODE)]).then(fcl.decode)
    res.status(200).json(true)
  } catch (error) {
    res.status(200).json(false)
  }
}
