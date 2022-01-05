import {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"

type CompositeSignature = {
  f_type: string
  f_vsn: string
  addr: string
  keyId: number
  signature: string
}

type AuthResponseService = {
  f_type: string
  f_vsn: string
  type: string
  uid: string
  endpoint?: string
  id?: string
  method?: string
  data?: Record<
    string,
    string | boolean | number | null | Array<CompositeSignature> | unknown
  >
  identity?: {
    address: string
    keyId?: number
  }
  provider?: {
    address: string | null
    name: string
    icon: string | null
    description: string
  }
  params?: Record<string, string>
}

const {publicRuntimeConfig} = getConfig()
const address = "0xf8d6e0586b0a20c7"
const keyId = 0

const services: AuthResponseService[] = [
  {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "authn",
    uid: "fcl-dev-wallet#authn",
    endpoint: `${publicRuntimeConfig.baseUrl}/fcl/authn`,
    id: address,
    identity: {
      address: address,
    },
    provider: {
      address: null,
      name: "FCL Dev Wallet",
      icon: null,
      description: "For Local Development Only",
    },
  },
  {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "authz",
    uid: "fcl-dev-wallet#authz",
    endpoint: `${publicRuntimeConfig.baseUrl}/fcl/authz`,
    method: "IFRAME/RPC",
    identity: {
      address: address,
      keyId: Number(keyId),
    },
  },
  {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "user-signature",
    uid: "fcl-dev-wallet#user-sig",
    endpoint: `${publicRuntimeConfig.baseUrl}/fcl/user-sig`,
    method: "IFRAME/RPC",
    id: address,
    data: {addr: address, keyId: Number(keyId)},
    params: {},
  },
  // Authentication Proof Service
  {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "account-proof",
    method: "DATA",
    uid: "fcl-dev-wallet#account-proof",
    data: {
      f_type: "account-proof",
      f_vsn: "1.0.0",
      address: address,
      timestamp: Date.now(),
      appDomainTag: "",
      signatures: null,
    },
  },
  // Authentication Refresh Service
  {
    f_type: "Service",
    f_vsn: "1.0.0",
    type: "authn-refresh",
    uid: "fcl-dev-wallet#authn-refresh",
    endpoint: `${publicRuntimeConfig.baseUrl}/api/refresh`,
    method: "HTTP/POST",
    id: address,
    data: {
      f_type: "authn-refresh",
      f_vsn: "1.0.0",
      address: address,
      keyId: Number(keyId),
    },
    params: {
      sessionId: "C7OXWaVpU-efRymW7a5d",
    },
  },
]

const response = {
  f_type: "PollingResponse",
  f_vsn: "1.0.0",
  status: "APPROVED",
  data: {
    f_type: "AuthnResponse",
    f_vsn: "1.0.0",
    addr: address,
    services: services,
  },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(response)
}
