import swr from "swr"
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

function createAccount() {}

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

export default function Authn() {
  const {data: accounts, error: aError} = swr(`/api/accounts`)

  return (
    <div className={css.root}>
      <h3>FCL Dev Wallet</h3>
      <button onClick={reply("FCL::CHALLENGE::CANCEL")}>
        Close Authn Frame
      </button>
      <hr />
      <Err error={aError} />
      <h3>Use Accounts</h3>
      <ul>{safe(accounts).map(Account)}</ul>
      <button onClick={createAccount}>Create New Account</button>
    </div>
  )
}
