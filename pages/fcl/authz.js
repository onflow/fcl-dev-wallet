import {useEffect, useState} from "react"
import * as fcl from "@onflow/fcl"
import swr from "swr"
import css from "../../styles/base.module.css"
import {Header} from "../../src/comps/header.comp.js"

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
      <Header
        onClose={reply("FCL:FRAME:CLOSE")}
        subHeader="Authorize Transaction"
      />
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Key Id</th>
            <th>Proposer</th>
            <th>Payer</th>
            <th>Authorizer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={css.bold}>{fcl.withPrefix(signable?.addr)}</td>
            <td>{signable?.keyId}</td>
            <td>{bool(signable?.roles?.proposer)}</td>
            <td>{bool(signable?.roles?.payer)}</td>
            <td>{bool(signable?.roles?.authorizer)}</td>
          </tr>
          <tr>
            <td colSpan="5">
              <pre>{JSON.stringify(signable?.args, null, 2)}</pre>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <pre>{signable?.cadence}</pre>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">
              <button onClick={reply("FCL:FRAME:CLOSE")}>Decline</button>
            </td>
            <td colSpan="3">
              <button onClick={sign}>Approve</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
