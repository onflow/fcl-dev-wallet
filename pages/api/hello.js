// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json({name: process.env.FLOW_ACCOUNT_ADDRESS})
}
