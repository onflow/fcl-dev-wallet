import {NextApiRequest, NextApiResponse} from "next"
import {requestApi} from "src/wasm-http"

// Placeholder URL (doesn't matter what it is)
const PLACEHOLDER_URL = "http://example.com"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    headers.set(key, value as string)
  }

  const request = new Request(`${PLACEHOLDER_URL}${req.url}`, {
    method: req.method!,
    headers,
    body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
  })

  await requestApi(request).then(async (resp: Response) => {
    res.status(resp.status)
    for (const [key, value] of resp.headers.entries()) {
      res.setHeader(key, value)
    }
    await resp.arrayBuffer().then(buffer => {
      res.end(Buffer.from(buffer))
    })
  })
}
