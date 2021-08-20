import {NextApiRequest, NextApiResponse} from "next"
import {sign} from "src/crypto"
import getConfig from "next/config"

const {serverRuntimeConfig} = getConfig()

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {message} = req.body

  res
    .status(200)
    .json({signature: sign(serverRuntimeConfig.flowAccountPrivateKey, message)})
}
