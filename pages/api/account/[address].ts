import {NextApiRequest, NextApiResponse} from "next"
import "src/fclConfig"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // eslint-disable-next-line no-console
  console.log(">>>", {method: req.method, query: req.query})
  res.status(200).json({type: "ACCOUNT"})
}
