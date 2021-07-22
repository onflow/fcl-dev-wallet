import * as fcl from "@onflow/fcl"
import {NextApiRequest, NextApiResponse} from "next"
import config from "src/config"
import "src/fclConfig"
import {Optional} from "types"
import getAccounts from "../../cadence/scripts/getAccounts.cdc"

export type Account = {
  type: "ACCOUNT"
  address: string
  scopes: string[]
  keyId?: number
  label?: string
}

export type NewAccount = Optional<Account, "address">

export type AccountsResponse = Account[]

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accounts = await fcl.send([fcl.script(getAccounts)]).then(fcl.decode)
    const serviceAccount = accounts.find(
      (acct: Account) => acct.address === config.flowAccountAddress
    )
    const userAccounts = accounts
      .filter((acct: Account) => acct.address !== config.flowAccountAddress)
      .reverse()
    res.status(200).json([serviceAccount, ...userAccounts].filter(Boolean))
  } catch (_error) {
    res.status(500).json([])
  }
}
