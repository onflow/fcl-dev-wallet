import {NextApiRequest, NextApiResponse} from "next"
import {requestApi} from "src/wasm-http"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    headers.set(key, value as string)
  }

  const request = new Request("http://example.com/api/polling-session", {
    method: req.method!,
    //headers,
    //body: req.body,
  })

  await requestApi(request).then(resp => {
    console.log(resp)
    res.end()
  })
}
