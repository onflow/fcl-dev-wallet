import "../../src/config"

export default (req, res) => {
  res.status(200).json({
    address: process.env.FLOW_ACCOUNT_ADDRESS,
    keyId: process.env.FLOW_ACCOUNT_KEY_ID,
    privateKey: process.env.FLOW_ACCOUNT_PRIVATE_KEY,
    accessNode: process.env.FLOW_ACCESS_NODE,
  })
}
