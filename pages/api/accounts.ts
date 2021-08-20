import * as fcl from "@onflow/fcl"
import getAccounts from "cadence/scripts/getAccounts.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import {Optional} from "types"
import fclConfig from "src/fclConfig"
import getConfig from "next/config"

export type Account = {
  type: "ACCOUNT"
  address: string
  scopes: string[]
  keyId?: number
  label?: string
}

export type NewAccount = Optional<Account, "address">

export type AccountsResponse = Account[]

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  fclConfig(
    serverRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress
  )

  try {
    const accounts = await fcl.send([fcl.script(getAccounts)]).then(fcl.decode)
    const serviceAccount = accounts.find(
      (acct: Account) => acct.address === publicRuntimeConfig.flowAccountAddress
    )
    const userAccounts = accounts
      .filter(
        (acct: Account) =>
          acct.address !== publicRuntimeConfig.flowAccountAddress
      )
      .reverse()
    res.status(200).json([serviceAccount, ...userAccounts].filter(Boolean))
  } catch (_error) {
    res.status(500).json([])
  }
}
