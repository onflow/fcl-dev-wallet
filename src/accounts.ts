import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Optional} from "types"

import newAccountTransaction from "cadence/transactions/newAccount.cdc"
import getAccountsScript from "cadence/scripts/getAccounts.cdc"
import getAccountScript from "cadence/scripts/getAccount.cdc"
import updateAccountTransaction from "cadence/transactions/updateAccount.cdc"

import getConfig from "next/config"
import {authz} from "src/authz"
import {FLOW_EVENT_TYPES} from "src/constants"
import fclConfig from "src/fclConfig"

const {publicRuntimeConfig} = getConfig()

export type Account = {
  type: "ACCOUNT"
  address: string
  scopes: string[]
  keyId?: number
  label?: string
  balance?: string
}

export type NewAccount = Optional<Account, "address">

type CreatedAccountResponse = {
  events: CreatedAccountEvent[]
}

type CreatedAccountEvent = {
  type: string
  data: {
    address: string
  }
}

export async function getAccount(address: string) {
  fclConfig(
    publicRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  return await fcl
    .send([
      fcl.script(getAccountScript),
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}

export async function getAccounts() {
  fclConfig(
    publicRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  const accounts = await fcl
    .send([fcl.script(getAccountsScript)])
    .then(fcl.decode)
  const serviceAccount = accounts.find(
    (acct: Account) => acct.address === publicRuntimeConfig.flowAccountAddress
  )
  const userAccounts = accounts
    .filter(
      (acct: Account) => acct.address !== publicRuntimeConfig.flowAccountAddress
    )
    .reverse()

  return [serviceAccount, ...userAccounts].filter(Boolean)
}

export async function newAccount(label: string, scopes: [string]) {
  fclConfig(
    publicRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  const authorization = await authz(
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.flowAccountKeyId,
    publicRuntimeConfig.flowAccountPrivateKey
  )

  const txId = await fcl
    .send([
      fcl.transaction(newAccountTransaction),
      fcl.args([fcl.arg(label, t.String), fcl.arg(scopes, t.Array(t.String))]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.limit(100),
    ])
    .then(fcl.decode)

  const txStatus: CreatedAccountResponse = await fcl.tx(txId).onceSealed()

  const createdAccountEvent = txStatus.events.find(
    (e: CreatedAccountEvent) => e.type === FLOW_EVENT_TYPES.accountCreated
  )
  if (!createdAccountEvent?.data?.address) throw "Account address not created"

  return createdAccountEvent.data.address
}

export async function updateAccount(
  address: string,
  label: string,
  scopes: [string]
) {
  address = fcl.withPrefix(address)

  fclConfig(
    publicRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  const authorization = await authz(
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.flowAccountKeyId,
    publicRuntimeConfig.flowAccountPrivateKey
  )

  const txId = await fcl
    .send([
      fcl.transaction(updateAccountTransaction),
      fcl.args([
        fcl.arg(address, t.Address),
        fcl.arg(label, t.String),
        fcl.arg(scopes, t.Array(t.String)),
      ]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.limit(100),
    ])
    .then(fcl.decode)

  await fcl.tx(txId).onceSealed()
}

// export async function fundAccount() {}
