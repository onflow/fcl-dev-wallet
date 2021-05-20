import { useEffect, useState } from 'react'
import * as fcl from '@onflow/fcl'
import swr from 'swr'
import css from '../../styles/base.module.css'
import { Header } from '../../src/comps/header.comp.js'

const reply =
  (type, msg = {}) =>
  e => {
    window.parent.postMessage({ ...msg, type }, '*')
  }

const bool = d => {
  return d ? 'Yes' : 'No'
}

export default function UserSign() {
  const [signable, setSignable] = useState(null)
  const [params, setParams] = useState(null)
  const [id, setId] = useState(null)

  useEffect(() => {
    function callback({ data }) {
      if (data == null) return
      if (data.jsonrpc != '2.0') return
      if (data.method != 'fcl:sign') return
      const [signable, params] = data.params
      delete signable.interaction
      setId(data.id)
      setSignable(signable)
      setParams(params)
    }

    window.addEventListener('message', callback)

    reply('FCL:FRAME:READY')()

    return () => window.removeEventListener('message', callback)
  }, [])

  async function signUserMessage() {
    const signature = await fetch('/api/user-sig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signable),
    })
      .then(d => d.json())
      .then(({ addr, keyId, signature }) => {
        window.parent.postMessage(
          {
            jsonrpc: '2.0',
            id: id,
            result: {
              f_type: 'PollingResponse',
              f_vsn: '1.0.0',
              status: 'APPROVED',
              reason: null,
              data: {
                f_type: 'CompositeSignature',
                f_vsn: '1.0.0',
                addr: fcl.withPrefix(addr),
                keyId: Number(keyId),
                signature: signature,
              },
            },
          },
          '*'
        )
        return signature
      })
      .catch(d => console.error('FCL-DEV-WALLET FAILED TO SIGN', d))
  }

  return (
    <div className={css.root}>
      <Header
        onClose={reply('FCL:FRAME:CLOSE')}
        subHeader='Sign message to prove you have access to this wallet.'
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
            <td colSpan='1'>
              <button onClick={reply('FCL:FRAME:CLOSE')}>Decline</button>
            </td>
            <td colSpan='1'></td>
            <td colSpan='1'>
              <button onClick={signUserMessage}>Approve</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
