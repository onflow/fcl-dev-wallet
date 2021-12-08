import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import txFundAccountFLOW from "cadence/transactions/fundFLOW.cdc"
import txFundAccountFUSD from "cadence/transactions/fundFUSD.cdc"
import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import {authz} from "src/authz"
import {FLOW_TYPE, FUSD_TYPE, TokenType, TokenTypes} from "src/constants"
import fclConfig from "src/fclConfig"

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

type Token = {
  tx: string
  amount: string
}
type Tokens = Record<TokenType, Token>

export const TOKEN_FUNDING_AMOUNTS: Record<TokenTypes, string> = {
  FLOW: publicRuntimeConfig.tokenAmountFLOW,
  FUSD: publicRuntimeConfig.tokenAmountFUSD,
}

export const tokens: Tokens = {
  FLOW: {tx: txFundAccountFLOW, amount: TOKEN_FUNDING_AMOUNTS[FLOW_TYPE]},
  FUSD: {tx: txFundAccountFUSD, amount: TOKEN_FUNDING_AMOUNTS[FUSD_TYPE]},
}

export default async function fund(req: NextApiRequest, res: NextApiResponse) {
  fclConfig(
    serverRuntimeConfig.flowAccessNode,
    publicRuntimeConfig.flowAccountAddress,
    publicRuntimeConfig.contractFungibleToken,
    publicRuntimeConfig.contractFlowToken,
    publicRuntimeConfig.contractFUSD
  )

  if (req.method === "POST") {
    const address = fcl.withPrefix(req.query.address)
    const token = req.body.token

    const minterAuthz = await authz(
      publicRuntimeConfig.flowAccountAddress,
      serverRuntimeConfig.flowAccountKeyId,
      serverRuntimeConfig.flowAccountPrivateKey
    )

    const acctAuthz = await authz(
      address,
      serverRuntimeConfig.flowAccountKeyId,
      serverRuntimeConfig.flowAccountPrivateKey
    )

    if (address === null) {
      res.status(400).json({errors: ["Missing address"]})
      return
    }

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

    res.status(200).json({token, amount})
  } else {
    res.status(405).send("")
  }
}
