import {useEffect, useState} from "react"
import * as fcl from "@onflow/fcl"
import swr from "swr"
import css from "../../styles/base.module.css"

const reply = (type, msg = {}) => e => {
  window.parent.postMessage({...msg, type}, "*")
}

const bool = d => {
  return d ? "Yes" : "No"
}

export default function Authz() {
  const [signable, setSignable] = useState(null)
  const [params, setParams] = useState(null)
  const [id, setId] = useState(null)

  useEffect(() => {
    function callback({data}) {
      if (data == null) return
      if (data.jsonrpc != "2.0") return
      if (data.method != "fcl:sign") return
      const [signable, params] = data.params
      delete signable.interaction
      setId(data.id)
      setSignable(signable)
      setParams(params)
    }

    window.addEventListener("message", callback)

    reply("FCL:FRAME:READY")()

    return () => window.removeEventListener("message", callback)
  }, [])

  async function sign() {
    const signature = await fetch("/api/sign", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: signable?.message}),
    })
      .then(d => d.json())
      .then(({signature}) => {
        window.parent.postMessage(
          {
            jsonrpc: "2.0",
            id: id,
            result: {
              f_type: "PollingResponse",
              f_vsn: "1.0.0",
              status: "APPROVED",
              reason: null,
              data: {
                f_type: "CompositeSignature",
                f_vsn: "1.0.0",
                addr: fcl.sansPrefix(signable.addr),
                keyId: Number(signable.keyId),
                signature: signature,
              },
            },
          },
          "*"
        )
      })
      .catch(d => console.error("FCL-DEV-WALLET FAILED TO SIGN", d))
  }

  return (
    <div className={css.root}>
      <h3>FCL Dev Wallet</h3>
      <button onClick={reply("FCL:FRAME:CLOSE")}>Close Authz Frame</button>
      <hr />
      <h4>Actions</h4>
      <div>
        <button onClick={reply("FCL:FRAME:CLOSE")}>Decline</button>
        <span> </span>
        <button onClick={sign}>Approve</button>
      </div>
      <h4>
        {fcl.withPrefix(signable?.addr)} | {signable?.keyId}
      </h4>
      <ul>
        {Object.keys(signable?.roles ?? {}).map(key => {
          return (
            <li key={key}>
              {key}: {bool(signable?.roles?.[key])}
            </li>
          )
        })}
      </ul>
      <h4>Cadence</h4>
      <pre>{signable?.cadence}</pre>
      <h4>Args</h4>
      <pre>{JSON.stringify(signable?.args, null, 2)}</pre>
      <h4>Message</h4>
      <pre>{signable?.message}</pre>
      <h4>Raw</h4>
      <pre>{JSON.stringify({signable, params}, null, 2)}</pre>
    </div>
  )
}
