import * as fcl from "@onflow/fcl"
import {useEffect, useState} from "react"
import {Header} from "src/comps/header.comp"
import css from "styles/base.module.css"

type AuthReadyData = {
  jsonrpc: string
  method: string
  params: AuthParams
  signable: unknown
  id: string
}

type AuthParams = [AuthSignable, unknown]

type AuthSignable = {
  addr: string
  args: string[]
  cadence: string
  f_type: "Signable"
  f_vsn: string
  keyId: number
  message: string
  roles: Record<string, boolean>
  interaction: unknown
  voucher: {
    arguments: string[]
    authorizers: string[]
    cadence: string
    computeLimit: number
    payer: string
    payloadSigs: string[]
    proposalKey: {
      address: string
      keyId: number
      sequenceNum: number
    }
    refBlock: string
  }
}

const reply =
  (type: string, msg = {}) =>
  () => {
    window.parent.postMessage({...msg, type}, "*")
  }

const boolString = (d: boolean) => {
  return d ? "Yes" : "No"
}

export default function Authz() {
  const [signable, setSignable] = useState<AuthSignable | null>(null)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    function callback({data}: {data: AuthReadyData}) {
      if (data == null) return
      if (data.jsonrpc != "2.0") return
      if (data.method != "fcl:sign") return
      const [signable] = data.params
      delete signable.interaction
      setId(data.id)
      setSignable(signable)
    }

    window.addEventListener("message", callback)

    reply("FCL:FRAME:READY")()

    return () => window.removeEventListener("message", callback)
  }, [])

  async function sign() {
    await fetch("/api/sign", {
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
                addr: fcl.sansPrefix(signable?.addr),
                keyId: Number(signable?.keyId),
                signature: signature,
              },
            },
          },
          "*"
        )
      })
      .catch(d => {
        // eslint-disable-next-line no-console
        console.error("FCL-DEV-WALLET FAILED TO SIGN", d)
      })
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
            <td>{boolString(!!signable?.roles?.proposer)}</td>
            <td>{boolString(!!signable?.roles?.payer)}</td>
            <td>{boolString(!!signable?.roles?.authorizer)}</td>
          </tr>
          <tr>
            <td colSpan={5}>
              <pre>{JSON.stringify(signable?.args, null, 2)}</pre>
            </td>
          </tr>
          <tr>
            <td colSpan={5}>
              <pre>{signable?.cadence}</pre>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              <button onClick={reply("FCL:FRAME:CLOSE")}>Decline</button>
            </td>
            <td colSpan={3}>
              <button onClick={sign}>Approve</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
