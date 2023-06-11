import {NextApiRequest, NextApiResponse} from "next"
import authSessions from "src/authSessions"
import * as crypto from "crypto"

const add = (a: number, b: number): number => a + b

type ObjectType =
  | "PollingResponse"
  | "Service"
  | "Identity"
  | "ServiceProvider"
  | "AuthnResponse"
  | "Signable"
  | "CompositeSignature"
  | "OpenID"

interface ObjectBase<Version = "1.0.0"> {
  f_vsn: Version
  f_type: ObjectType
}

interface PostBody {
  f_type: "Service"
  f_vsn: string
  type: string
  method: string
  endpoint: string
  data: {[key: string]: string}
  params: {[key: string]: string}
}

interface AuthnResponse extends ObjectBase {
  f_type: "AuthnResponse"
  addr: string
  services: any[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const l6n = req.query.l6n as string

  if (req.method === "OPTIONS") {
    // Handle OPTIONS request
    return res.status(200).end()
  } else if (req.method === "GET") {
    const authId = req.query.authId as string

    if (authSessions[authId]) {
      return res.status(200).json(authSessions[authId])
    } else {
      return res.status(200).json({
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        status: "PENDING",
        updates: {
          f_type: "PollingResponse",
          f_vsn: "1.0.0",
          type: "back-channel-rpc",
          endpoint: "http://localhost:8701/api/authn",
          method: "HTTP/GET",
          params: {
            l6n,
            authId: authId,
          },
        },
      })
    }
  } else if (req.method === "POST") {
    const fclMessageJson = JSON.stringify(req.body)
    const authId = crypto.randomUUID()

    return res.status(200).json({
      f_type: "PollingResponse",
      f_vsn: "1.0.0",
      status: "PENDING",
      updates: {
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        type: "back-channel-rpc",
        endpoint: "http://localhost:8701/api/authn",
        method: "HTTP/GET",
        params: {
          authId,
          l6n,
          fclMessageJson,
        },
      },
      local: {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "local-view",
        endpoint: "http://localhost:8701/fcl/authn",
        method: "VIEW/IFRAME",
        params: {
          channel: "back",
          fclMessageJson,
          authId,
          l6n,
        },
      },
    })
  } else {
    return res.status(405).json({error: "Method not allowed"})
  }
}
