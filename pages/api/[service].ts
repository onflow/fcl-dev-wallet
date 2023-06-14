import {NextApiRequest, NextApiResponse} from "next"
import * as crypto from "crypto"
import PollingSessions from "src/pollingSessions"
import {cors} from "src/middleware"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Run cors middleware
  await cors(req, res)

  const service = req.query.service as string
  const l6n = req.query.l6n as string

  if (req.method === "POST") {
    const fclMessageJson = JSON.stringify(req.body)
    const pollingId = crypto.randomUUID()

    const pendingResponse = {
      f_type: "PollingResponse",
      f_vsn: "1.0.0",
      status: "PENDING",
      updates: {
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        type: "back-channel-rpc",
        endpoint: "http://localhost:8701/api/polling-session",
        method: "HTTP/GET",
        params: {
          pollingId,
        },
      },
    }

    PollingSessions.set(pollingId, pendingResponse)

    return res.status(200).json({
      ...pendingResponse,
      local: {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "local-view",
        endpoint: `http://localhost:8701/fcl/${service}`,
        method: "VIEW/IFRAME",
        params: {
          channel: "back",
          fclMessageJson,
          pollingId,
          l6n,
        },
      },
    })
  } else {
    return res.status(405).json({error: "Method not allowed"})
  }
}
