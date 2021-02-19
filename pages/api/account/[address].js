import "../../../src/config"

export default async (req, res) => {
  console.log(">>>", {method: req.method, query: req.query})
  res.status(200).json({type: "ACCOUNT"})
}
