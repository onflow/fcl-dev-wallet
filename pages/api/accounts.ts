import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import config from "src/config"
import "src/fclConfig"

export type Account = {
  type: "ACCOUNT"
  address: string
  keyId?: number
  label?: string
}

export type AccountsResponse = Account[]

const SERVICE_ACCOUNT = {
  type: "ACCOUNT",
  address: config.flowAccountAddress,
  keyId: config.flowAccountKeyId,
  label: "Service Account",
}

const CODE = `
import FCL from 0xSERVICE

pub fun main(): [FCL.Account] {
  return FCL.accounts().values
}
`.trim()

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accounts = await fcl.send([fcl.script(CODE)]).then(fcl.decode)
    res.status(200).json([SERVICE_ACCOUNT, ...accounts])
  } catch (_error) {
    res.status(200).json([SERVICE_ACCOUNT])
  }
}
