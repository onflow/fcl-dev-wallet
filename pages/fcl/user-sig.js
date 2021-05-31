import {useEffect, useState} from "react"
import * as fcl from "@onflow/fcl"
import swr from "swr"
import css from "../../styles/base.module.css"
import {Header} from "../../src/comps/header.comp.js"

const reply = (type, msg = {}) => e => {
  window.parent.postMessage({...msg, type}, "*")
}

export default function UserSign() {
  const [signable, setSignable] = useState(null)

  useEffect(() => {
    function callback({data}) {
      if (data === null) return
      if (typeof data !== "object") return
      if (data.type === "FCL:FRAME:READY:RESPONSE") {
        setSignable(data.body)
      }
    }

    window.addEventListener("message", callback)

    reply("FCL:FRAME:READY")()

    return () => window.removeEventListener("message", callback)
  }, [])

  async function signUserMessage() {
    const signature = await fetch("/api/user-sig", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(signable),
    })
      .then(d => d.json())
      .then(({addr, keyId, signature}) => {
        reply("FCL:FRAME:RESPONSE", {
          f_type: "PollingResponse",
          f_vsn: "1.0.0",
          status: "APPROVED",
          reason: null,
          data: {
            f_type: "CompositeSignature",
            f_vsn: "1.0.0",
            addr: fcl.withPrefix(addr),
            keyId: Number(keyId),
            signature: signature,
          },
        })()
      })
      .catch(d => console.error("FCL-DEV-WALLET FAILED TO SIGN", d))
  }

  const declineSign = () => {
    reply("FCL:FRAME:RESPONSE", {
      f_type: "PollingResponse",
      f_vsn: "1.0.0",
      status: "DECLINED",
      reason: null,
    })()
  }

  return (
    <div className={css.root}>
      <Header
        onClose={reply("FCL:FRAME:CLOSE")}
        subHeader="Sign message to prove you have access to this wallet."
      />
      <h4>This won’t cost you any Flow.</h4>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Key Id</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={css.bold}>{fcl.withPrefix(signable?.data.addr)}</td>
            <td>{signable?.data.keyId}</td>
            <td>{signable?.message}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="1">
              <button onClick={declineSign}>Decline</button>
            </td>
            <td colSpan="1"></td>
            <td colSpan="1">
              <button onClick={signUserMessage}>Approve</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
