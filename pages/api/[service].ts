import {NextApiRequest, NextApiResponse} from "next"
import authSessions from "src/pollingSessions"
import * as crypto from "crypto"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const service = req.query.service as string
  const l6n = req.query.l6n as string

  if (req.method === "OPTIONS") {
    // Handle OPTIONS request
    return res.status(200).end()
  } else if (req.method === "POST") {
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

    authSessions[pollingId] = pendingResponse

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
