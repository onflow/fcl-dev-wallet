module.exports = {
  webpack: (config, _options) => {
    config.module.rules.push({
      test: /\.cdc/,
      type: "asset/source",
    })
    return config
  },
  serverRuntimeConfig: {
    flowAccessNode: process.env.FLOW_ACCESS_NODE,
    flowAccountKeyId: process.env.FLOW_ACCOUNT_KEY_ID,
    flowAccountPrivateKey: process.env.FLOW_ACCOUNT_PRIVATE_KEY,
    flowAccountPublicKey: process.env.FLOW_ACCOUNT_PUBLIC_KEY,
    flowInitAccountsNo: process.env.FLOW_INIT_ACCOUNTS,
  },
  publicRuntimeConfig: {
    flowAccountAddress: process.env.FLOW_ACCOUNT_ADDRESS,
    avatarUrl: process.env.FLOW_AVATAR_URL,
    contractFungibleToken: process.env.CONTRACT_FUNGIBLE_TOKEN,
    contractFlowToken: process.env.CONTRACT_FLOW_TOKEN,
    contractFUSD: process.env.CONTRACT_FUSD,
    tokenAmountFLOW: process.env.TOKEN_AMOUNT_FLOW,
    tokenAmountFUSD: process.env.TOKEN_AMOUNT_FUSD,
  },
}
