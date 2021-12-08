import * as fcl from "@onflow/fcl"
import getAccounts from "cadence/scripts/getAccounts.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import fclConfig from "src/fclConfig"
import {Optional} from "types"

export type Account = {
  type: "ACCOUNT"
  address: string
  scopes: string[]
  keyId?: number
  label?: string
  balance?: number
}

export type NewAccount = Optional<Account, "address">

export type AccountsResponse = Account[]

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  fclConfig(
    serverRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
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
