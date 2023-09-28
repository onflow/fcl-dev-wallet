import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {Optional} from "types"

import getAccountsScript from "cadence/scripts/getAccounts.cdc"
import getAccountScript from "cadence/scripts/getAccount.cdc"
import getFUSDBalanceScript from "cadence/scripts/getFUSDBalance.cdc"
import newAccountTransaction from "cadence/transactions/newAccount.cdc"
import updateAccountTransaction from "cadence/transactions/updateAccount.cdc"
import fundAccountFLOWTransaction from "cadence/transactions/fundFLOW.cdc"
import fundAccountFUSDTransaction from "cadence/transactions/fundFUSD.cdc"

import {authz} from "src/authz"
import {FLOW_EVENT_TYPES} from "src/constants"

import {FLOW_TYPE, FUSD_TYPE, TokenType, TokenTypes} from "src/constants"

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
  return await fcl
    .send([
      fcl.script(getAccountScript),
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}

export async function getAccounts(config: {flowAccountAddress: string}) {
  const {flowAccountAddress} = config

  const accounts = await fcl
    .send([fcl.script(getAccountsScript)])
    .then(fcl.decode)

  const serviceAccount = accounts.find(
    (acct: Account) => acct.address === flowAccountAddress
  )

  const userAccounts = accounts
    .filter((acct: Account) => acct.address !== flowAccountAddress)
    .sort((a: Account, b: Account) => a.label!.localeCompare(b.label!))

  return [serviceAccount, ...userAccounts]
}

export async function newAccount(
  config: {
    flowAccountAddress: string
    flowAccountKeyId: string
    flowAccountPrivateKey: string
    flowInitAccountBalance: string
  },
  label: string,
  scopes: [string]
) {
  const {
    flowAccountAddress,
    flowAccountKeyId,
    flowAccountPrivateKey,
    flowInitAccountBalance,
  } = config

  const authorization = await authz(
    flowAccountAddress,
    flowAccountKeyId,
    flowAccountPrivateKey
  )

  const txId = await fcl
    .send([
      fcl.transaction(newAccountTransaction),
      fcl.args([
        fcl.arg(label, t.String),
        fcl.arg(scopes, t.Array(t.String)),
        fcl.arg(flowInitAccountBalance, t.UFix64),
      ]),
      fcl.authorizations([authorization]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.limit(9999),
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
  config: {
    flowAccountAddress: string
    flowAccountKeyId: string
    flowAccountPrivateKey: string
  },
  address: string,
  label: string,
  scopes: [string]
) {
  const {flowAccountAddress, flowAccountKeyId, flowAccountPrivateKey} = config
  address = fcl.withPrefix(address)

  const authorization = await authz(
    flowAccountAddress,
    flowAccountKeyId,
    flowAccountPrivateKey
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
      fcl.limit(9999),
    ])
    .then(fcl.decode)

  await fcl.tx(txId).onceSealed()
}

type Token = {
  tx: string
  amount: string
}

type Tokens = Record<TokenType, Token>

export const TOKEN_FUNDING_AMOUNTS: Record<TokenTypes, string> = {
  FLOW: "100.0",
  FUSD: "100.0",
}

export const tokens: Tokens = {
  FLOW: {
    tx: fundAccountFLOWTransaction,
    amount: TOKEN_FUNDING_AMOUNTS[FLOW_TYPE],
  },
  FUSD: {
    tx: fundAccountFUSDTransaction,
    amount: TOKEN_FUNDING_AMOUNTS[FUSD_TYPE],
  },
}

export async function fundAccount(
  config: {
    flowAccountAddress: string
    flowAccountKeyId: string
    flowAccountPrivateKey: string
  },
  address: string,
  token: TokenType
) {
  const {flowAccountAddress, flowAccountKeyId, flowAccountPrivateKey} = config

  if (!["FUSD", "FLOW"].includes(token)) {
    throw "Incorrect TokenType"
  }

  const minterAuthz = await authz(
    flowAccountAddress,
    flowAccountKeyId,
    flowAccountPrivateKey
  )

  const acctAuthz = await authz(
    address,
    flowAccountKeyId,
    flowAccountPrivateKey
  )

  const {tx, amount} = tokens[token]

  const authorizations =
    token === FUSD_TYPE ? [minterAuthz, acctAuthz] : [minterAuthz]

  const txId = await fcl
    .send([
      fcl.transaction(tx),
      fcl.args([fcl.arg(address, t.Address), fcl.arg(amount, t.UFix64)]),
      fcl.proposer(minterAuthz),
      fcl.authorizations(authorizations),
      fcl.payer(minterAuthz),
      fcl.limit(9999),
    ])
    .then(fcl.decode)

  await fcl.tx(txId).onceSealed()
}

export async function getAccountFUSDBalance(address: string): Promise<number> {
  const balance = await fcl
    .send([
      fcl.script(getFUSDBalanceScript),
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)

  return balance
}
