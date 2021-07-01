import {NextApiRequest, NextApiResponse} from "next"
import config from "src/config"
import {sign} from "src/crypto"
import "src/fclConfig"

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {message} = req.body

  res.status(200).json({signature: sign(config.flowAccountPrivateKey, message)})
}
