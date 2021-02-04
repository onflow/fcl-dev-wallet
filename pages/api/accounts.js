export default (req, res) => {
  res.status(200).json([
    {type: "ACCOUNT", address: "0x01"},
    {type: "ACCOUNT", address: "0x02"},
    {type: "ACCOUNT", address: "0x03"},
    {type: "ACCOUNT", address: "0x04"},
  ])
}
