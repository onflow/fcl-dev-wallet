import swr, {mutate} from "swr"
import css from "../../styles/base.module.css"

const reply = (type, msg = {}) => e => {
  e.preventDefault()
  window.parent.postMessage({...msg, type}, "*")
}

function Err({error}) {
  if (error == null) return null
  return (
    <div className={css.bad}>
      <pre>{error.stack}</pre>
    </div>
  )
}

function safe(dx) {
  return Array.isArray(dx) ? dx : []
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

function Account(props) {
  const {address, keyId} = props
  return (
    <div key={address}>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      <button
        onClick={reply("FCL::CHALLENGE::RESPONSE", {
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
        })}
      >
        Use: {address}
      </button>
    </div>
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
      <h3>FCL Dev Wallet</h3>
      <button onClick={reply("FCL::CHALLENGE::CANCEL")}>
        Close Authn Frame
      </button>
      <hr />
      <Err error={accounts.error} />
      <h3>Use Account</h3>
      <ul>{safe(accounts?.data).map(Account)}</ul>
      {isInit.data ? (
        <button onClick={createAccount}>Create New Account</button>
      ) : (
        <button onClick={initAccounts}>
          Initialize Dev Wallet for more Accounts
        </button>
      )}
    </div>
  )
}
