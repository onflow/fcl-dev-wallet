import {NextApiRequest, NextApiResponse} from "next"
import {cors} from "src/middleware"
import PollingSessions from "src/pollingSessions"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Run cors middleware
  await cors(req, res)

  if (req.method === "POST") {
    const {pollingId, data} = req.body

    if (!pollingId) {
      return res
        .status(400)
        .json({error: "Missing required parameter: pollingId"})
    }

    if (!data) {
      return res.status(400).json({error: "Missing required parameter: data"})
    }

    // Store the data in the global authSessions object
    // NOTE: This is not acceptable for a production environment and this method of
    // backchannel communication should be replaced with a more secure method.
    PollingSessions.set(pollingId, data)

    return res.status(200).end()
  } else if (req.method === "GET") {
    const {pollingId} = req.query

    if (!pollingId) {
      return res
        .status(400)
        .json({error: "Missing required parameter: pollingId"})
    }

    if (typeof pollingId !== "string") {
      return res.status(400).json({error: "Invalid parameter: pollingId"})
    }

    const data = PollingSessions.get(pollingId)

    if (!data) {
      return res.status(404).json({error: "Not found"})
    }

    return res.status(200).json(data)
  } else {
    return res.status(405).json({error: "Method not allowed"})
  }
}
