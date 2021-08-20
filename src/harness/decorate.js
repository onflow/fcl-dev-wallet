import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export default function decorate() {
  window.fcl = fcl
  window.t = t

  window.addEventListener("FLOW::TX", d => {
    // eslint-disable-next-line no-console
    console.log("FLOW::TX", d.detail.delta, d.detail.txId)
    fcl
      .tx(d.detail.txId)
      // eslint-disable-next-line no-console
      .subscribe(txStatus => console.log("TX:STATUS", d.detail.txId, txStatus))
  })

  window.addEventListener("message", d => {
    // eslint-disable-next-line no-console
    console.log("Harness Message Received", d.data)
  })
}
