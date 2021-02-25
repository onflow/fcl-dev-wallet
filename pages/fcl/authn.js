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

function chooseAccount(props) {
  console.log("RAWR")
  const {address, keyId} = props

  return reply("FCL::CHALLENGE::RESPONSE", {
    addr: address,
    services: [
      {
        f_type: "Service",
        f_vsn: "1.0.0",
        type: "authn",
        uid: "fcl-dev-wallet#authn",
        endpoint: "http://localhost:3000/fcl/authn",
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
        endpoint: "http://localhost:3000/fcl/authz",
        method: "IFRAME/RPC",
        identity: {
          address: address,
          keyId: Number(keyId),
        },
      },
    ],
  })
}

function AccountRow(props) {
  const {address, keyId, label} = props

  return (
    <tr key={[address, keyId].filter(Boolean).join("-")}>
      <td className={css.bold}>{address}</td>
      <td>{keyId}</td>
      <td>{label}</td>
      <td>
        <button onClick={chooseAccount(props)}>Use</button>
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

  if (isInit.data == null) return <div className={css.root}>...</div>

  return (
    <div className={css.root}>
      <Header
        onClose={reply("FCL::CHALLENGE::CANCEL")}
        subHeader="Choose Account"
        error={accounts.error}
      />
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Key Id</th>
            <th>Label</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{safe(accounts?.data).map(AccountRow)}</tbody>
        <tfoot>
          <tr>
            <td colSpan="4">
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
