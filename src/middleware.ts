import Cors from "cors"
import {NextApiRequest, NextApiResponse} from "next"

type CorsMiddleware = (
  req: NextApiRequest,
  res: {
    statusCode?: number | undefined
    setHeader(key: string, value: string): unknown
    end(): unknown
  },
  next: (err?: unknown) => unknown
) => void

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function initMiddleware(middleware: CorsMiddleware) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      const result = () => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      }
      middleware(req, res, result)
    })
}

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET", "POST", "OPTIONS"],
  })
)

export {cors}
