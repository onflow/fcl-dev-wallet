import {useState, useEffect} from "react"
import swr, {mutate} from "swr"
import css from "../../styles/base.module.css"
import {safe} from "../../src/safe.js"
import {Header} from "../../src/comps/header.comp.js"
import {Err} from "../../src/comps/err.comp.js"

const reply = (type, msg = {}) => e => {
  e.preventDefault()
  window.parent.postMessage({...msg, type}, "*")
}

async function createAccount() {
  await fetch("/api/account/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
  mutate("/api/accounts")
}

const PROFILE_SCOPES = new Set(
  "name family_name given_name middle_name nickname preferred_username profile picture website gender birthday zoneinfo locale updated_at"
    .trim()
    .split(/\s+/)
)
const EMAIL_SCOPES = new Set("email email_verified".trim().split(/\s+/))
const ADDRESS_SCOPES = new Set("address".trim().split(/\s+/))
const PHONE_SCOPES = new Set(
  "phone_number phone_number_verified".trim().split(/\s+/)
)
const SOCIAL_SCOPES = new Set("twitter twitter_verified".trim().split(/\s+/))

const intersection = (a, b) => new Set([...a].filter(x => b.has(x)))
const entries = (arr = []) => Object.fromEntries(arr.filter(Boolean))
const entry = (scopes, key, value) => scopes.has(key) && [key, value]

function authnResponse(data) {
  return e => {
    reply("FCL:FRAME:RESPONSE", data)(e)
    /* backwards compatibility with fcl@0.0.67 */
    reply("FCL::CHALLENGE::RESPONSE", data)(e)
  }
}

function chooseAccount(props, scopes) {
  const {address, keyId} = props
  scopes = Object.entries(scopes).reduce((acc, [scope, include]) => {
    if (include) acc.add(scope)
    return acc
  }, new Set([]))

  // return reply("FCL:FRAME:RESPONSE", {
  return authnResponse({
    addr: address,
    services: [
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

      !!scopes.size && {
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
            // intersection(ADDRESS_SCOPES, scopes).size && [
            //   "address",
            //   entries([]),
            // ],
            // intersection(PHONE_SCOPES, scopes).size && ["phone", entries([])],
            // intersection(SOCIAL_SCOPES, scopes).size && ["social", entries([])],
          ]),
        },
      },
    ].filter(Boolean),
  })
}

function AccountRow(props) {
  const {address, keyId, label} = props
  const [scopes, setScopes] = useState(
    props?.scopes
      ?.trim()
      ?.split(/\s+/)
      ?.filter(Boolean)
      ?.reduce((acc, scope) => ({...acc, [scope]: false}), {})
  )

  function toggleScope(scope) {
    return () => {
      setScopes(scopes => ({...scopes, [scope]: !scopes[scope]}))
    }
  }

  return (
    <tr key={[address, keyId].filter(Boolean).join("-")}>
      <td className={css.bold}>{address}</td>
      <td>{keyId}</td>
      <td>{label}</td>
      {Object.keys(scopes).map(scope => (
        <td key={scope}>
          <input
            type="checkbox"
            selected={scopes[scope]}
            onClick={toggleScope(scope)}
          />
        </td>
      ))}
      <td>
        <button onClick={chooseAccount(props, scopes)}>Use</button>
      </td>
    </tr>
  )
}

const initAccounts = async () => {
  await fetch("/api/init", {
    method: "POST",
  })
  mutate("/api/accounts")
  mutate("/api/is-init")
}

export default function Authn() {
  const isInit = swr("/api/is-init")
  const accounts = swr("/api/accounts")
  const [config, setConfig] = useState(null)

  useEffect(() => {
    function callback(e) {
      if (typeof e.data !== "object") return
      if (e.data.type !== "FCL:AUTHN:CONFIG") return
      setConfig(e.data)
    }
    window.addEventListener("message", callback)
    window.parent.postMessage({type: "FCL:FRAME:READY"}, "*")

    return () => {
      window.removeEventListener("message", callback)
    }
  }, [])

  if (isInit.data == null)
    return <div className={css.root}>... Null Data ...</div>
  // if (config == null) return <div className={css.root}>... Null Config ...</div>

  const scopes = config?.services?.["OpenID.scopes"]?.trim()?.split(/\s+/) ?? []

  return (
    <div className={css.root}>
      <Header
        onClose={reply("FCL:FRAME:CLOSE")}
        subHeader="Choose Account"
        error={accounts.error}
      >
        <ul>
          <li>
            <code>app.detail.title</code>:<span> </span>
            <strong>{config?.app?.title ?? "--"}</strong>
          </li>
          <li>
            <code>app.detail.icon</code>:<span> </span>
            {config?.app?.icon && (
              <>
                <img src={config.app.icon} width="16" height="16" />
                <span> </span>
              </>
            )}
            <strong>{config?.app?.icon ?? "--"}</strong>
          </li>
          <li>
            <code>service.OpenID.scopes</code>:<span> </span>
            <strong>{scopes.length ? scopes.join(" ") : "--"}</strong>
          </li>
        </ul>
      </Header>
      <table>
        <thead>
          {!!scopes.length && (
            <tr>
              <td colSpan="3"></td>
              <th colSpan={scopes.length}>Scopes</th>
              <td></td>
            </tr>
          )}
          <tr>
            <th>Address</th>
            <th>Key Id</th>
            <th>Label</th>
            {scopes.map(scope => (
              <th key={scope}>{scope}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {safe(accounts?.data).map(acct => {
            return (
              <AccountRow
                key={[acct.address, acct.keyId].join("-")}
                scopes={scopes.join(" ")}
                {...acct}
              />
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4 + scopes.length}>
              {isInit.data ? (
                <button onClick={createAccount}>Create New Account</button>
              ) : (
                <button onClick={initAccounts}>
                  Initialize Dev Wallet for more Accounts
                </button>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
