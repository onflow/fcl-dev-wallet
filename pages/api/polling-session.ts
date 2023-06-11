import {NextApiRequest, NextApiResponse} from "next"
import pollingSessions from "src/pollingSessions"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    // Handle OPTIONS request
    return res.status(200).end()
  } else if (req.method === "POST") {
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
    pollingSessions[pollingId] = data

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

    const data = pollingSessions[pollingId]

    if (!data) {
      return res.status(404).json({error: "Not found"})
    }

    return res.status(200).json(data)
  } else {
    return res.status(405).end()
  }
}
