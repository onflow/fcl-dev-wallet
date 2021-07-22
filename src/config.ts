type Config = {
  flowAccessNode: string
  flowAccountAddress: string
  flowAccountKeyId: string
  flowAccountPrivateKey: string
  flowAccountPublicKey: string
  flowInitAccountsNo: number
}

const flowAccessNode = process.env.FLOW_ACCESS_NODE
if (!flowAccessNode) throw "Missing FLOW_ACCESS_NODE"

const flowAccountAddress = process.env.FLOW_ACCOUNT_ADDRESS
if (!flowAccountAddress) throw "Missing FLOW_ACCOUNT_ADDRESS"

const flowAccountKeyId = process.env.FLOW_ACCOUNT_KEY_ID
if (!flowAccountKeyId) throw "Missing FLOW_ACCOUNT_KEY_ID"

const flowAccountPrivateKey = process.env.FLOW_ACCOUNT_PRIVATE_KEY
if (!flowAccountPrivateKey) throw "Missing FLOW_ACCOUNT_PRIVATE_KEY"

const flowAccountPublicKey = process.env.FLOW_ACCOUNT_PUBLIC_KEY
if (!flowAccountPublicKey) throw "Missing FLOW_ACCOUNT_PUBLIC_KEY"

const flowInitAccountsNo = process.env.FLOW_INIT_ACCOUNTS_NO
if (!flowInitAccountsNo) throw "Missing FLOW_INIT_ACCOUNTS_NO"

const config: Config = {
  flowAccessNode,
  flowAccountAddress,
  flowAccountKeyId,
  flowAccountPrivateKey,
  flowAccountPublicKey,
  flowInitAccountsNo: Number(flowInitAccountsNo),
}

export default config
