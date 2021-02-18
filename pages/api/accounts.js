import "../../flow/config"

export default (req, res) => {
  res.status(200).json([
    {
      type: "ACCOUNT",
      address: process.env.FLOW_ACCOUNT_ADDRESS,
      keyId: process.env.FLOW_ACCOUNT_KEY_ID,
      label: "Service Account",
    },
  ])
}
