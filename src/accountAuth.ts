import {WalletUtils, withPrefix} from "@onflow/fcl"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import {Account} from "pages/api/accounts"
import {paths} from "src/constants"

const PROFILE_SCOPES = new Set(
  "name family_name given_name middle_name nickname preferred_username profile picture website gender birthday zoneinfo locale updated_at"
    .trim()
    .split(/\s+/)
)
const EMAIL_SCOPES = new Set("email email_verified".trim().split(/\s+/))

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
    string | boolean | number | null | CompositeSignature | unknown
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

const intersection = (a: Set<string>, b: Set<string>) =>
  new Set([...a].filter(x => b.has(x)))

function entries<T>(arr: Array<T> = []) {
  const arrEntries = [arr].flatMap(a => a).filter(Boolean) as Iterable<
    readonly [PropertyKey, string]
  >
  return Object.fromEntries(arrEntries)
}

const entry = (
  scopes: Set<string>,
  key: string,
  value: string | boolean | number
) => scopes.has(key) && [key, value]

export async function chooseAccount(
  account: Account,
  scopes: Set<string>,
  connectedAppConfig: ConnectedAppConfig
) {
  const {address, keyId} = account

  const {timeStamp, message, domainTag} = connectedAppConfig.body
  const signable = {
    message,
    data: {addr: address, keyId, timeStamp, domainTag},
  }
  const compSig = await fetch(paths.userSig, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(signable),
  })
    .then(d => d.json())
    .then(({addr, keyId, signature}) => {
      return {
        f_type: "CompositeSignature",
        f_vsn: "1.0.0",
        addr: withPrefix(addr),
        keyId: Number(keyId),
        signature: signature,
      }
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error("FCL-DEV-WALLET FAILED TO SIGN", e)
    })

  const services: AuthResponseService[] = [
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authn",
      uid: "fcl-dev-wallet#authn",
      endpoint: `${location.origin}/fcl/authn`,
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
      endpoint: `${location.origin}/fcl/authz`,
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
      endpoint: `${location.origin}/fcl/user-sig`,
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
        message: message,
        timestamp: timeStamp,
        domainTag: domainTag,
        signature: compSig ?? null,
      },
    },
  ]

  if (!!scopes.size) {
    services.push({
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "open-id",
      uid: "fcl-dev-wallet#open-id",
      method: "data",
      data: {
        f_type: "OpenID",
        f_vsn: "1.0.0",
        ...entries([
          intersection(PROFILE_SCOPES, scopes).size && [
            "profile",
            entries([
              entry(scopes, "name", `name[${address}]`),
              entry(scopes, "family_name", `family_name[${address}]`),
              entry(scopes, "given_name", `given_name[${address}]`),
              entry(scopes, "middle_name", `middle_name[${address}]`),
              entry(scopes, "nickname", `nickname[${address}]`),
              entry(
                scopes,
                "preferred_username",
                `preferred_username[${address}]`
              ),
              entry(scopes, "profile", `https://onflow.org`),
              entry(
                scopes,
                "piture",
                `https://https://avatars.onflow.org/avatar/${address}`
              ),
              entry(scopes, "website", "https://onflow.org"),
              entry(scopes, "gender", `gender[${address}]`),
              entry(
                scopes,
                "birthday",
                `0000-${new Date().getMonth() + 1}-${new Date().getDate()}`
              ),
              entry(scopes, "zoneinfo", `America/Vancouver`),
              entry(scopes, "locale", `en`),
              entry(scopes, "updated_at", Date.now()),
            ]),
          ],
          intersection(EMAIL_SCOPES, scopes).size && [
            "email",
            entries([
              entry(scopes, "email", `${address}@example.com`),
              entry(scopes, "email_verified", true),
            ]),
          ],
        ]),
      },
    })
  }

  localStorage.setItem("connectedAppConfig", JSON.stringify(connectedAppConfig))

  WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", {
    addr: address,
    services,
  })
}
