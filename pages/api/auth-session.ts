import {NextApiRequest, NextApiResponse} from "next"
import authSessions from "src/authSessions"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    // Handle OPTIONS request
    return res.status(200).end()
  } else if (req.method === "POST") {
    const {id, data} = req.body

    if (!id) {
      return res.status(400).json({error: "Missing required parameter: id"})
    }

    if (!data) {
      return res.status(400).json({error: "Missing required parameter: data"})
    }

    // Store the data in the global authSessions object
    // NOTE: This is not acceptable for a production environment and this method of
    // backchannel communication should be replaced with a more secure method.
    authSessions[id] = data

    return res.status(200).end()
  } else if (req.method === "GET") {
    const {id} = req.query

    if (!id) {
      return res.status(400).json({error: "Missing required parameter: id"})
    }

    if (typeof id !== "string") {
      return res.status(400).json({error: "Invalid parameter: id"})
    }

    const data = authSessions[id]

    if (!data) {
      return res.status(404).json({error: "Not found"})
    }

    return res.status(200).json(data)
  } else {
    return res.status(405).end()
  }
}
