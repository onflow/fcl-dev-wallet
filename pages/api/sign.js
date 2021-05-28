import "../../src/config"
import {sign} from "../../src/crypto"

export default (req, res) => {
  const {message} = req.body

  res
    .status(200)
    .json({signature: sign(process.env.FLOW_ACCOUNT_PRIVATE_KEY, message)})
}
