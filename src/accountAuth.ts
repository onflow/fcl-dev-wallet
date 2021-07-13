import {Account} from "pages/api/accounts"

const PROFILE_SCOPES = new Set(
  "name family_name given_name middle_name nickname preferred_username profile picture website gender birthday zoneinfo locale updated_at"
    .trim()
    .split(/\s+/)
)
const EMAIL_SCOPES = new Set("email email_verified".trim().split(/\s+/))

export type ScopesObj = Record<string, boolean>

type AuthResponseService = {
  f_type: string
  f_vsn: string
  type: string
  uid: string
  endpoint?: string
  id?: string
  method?: string
  data?: Record<string, string | boolean | number>
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

type AuthResponseData = {
  addr?: string
  services: AuthResponseService[]
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

const reply =
  (type: string, msg = {}) =>
  (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    window.parent.postMessage({...msg, type}, "*")
  }

function authnResponse(data: AuthResponseData) {
  return (e: React.MouseEvent<HTMLElement>) => {
    reply("FCL:FRAME:RESPONSE", data)(e)
    /* backwards compatibility with fcl@0.0.67 */
    reply("FCL::CHALLENGE::RESPONSE", data)(e)
  }
}

export function chooseAccount(account: Account, scopesObj: ScopesObj) {
  const {address, keyId} = account
  const scopes = Object.entries(scopesObj).reduce(
    (acc: Set<string>, [scope, include]) => {
      if (include) acc.add(scope)
      return acc
    },
    new Set([])
  )

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

  return authnResponse({
    addr: address,
    services,
  })
}
