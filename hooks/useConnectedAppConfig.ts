import {WalletUtils} from "@onflow/fcl"
import {useEffect, useState} from "react"
import {parseScopes} from "src/scopes"

export type ConnectedAppConfig = {
  type: string
  body: {
    appIdentifier?: string | undefined
    data: unknown
    extensions: unknown[]
    nonce?: string | undefined
  }
  service: Record<string, unknown>
  config: {
    services: {"OpenID.scopes": string}
    app: {
      icon: string
      title: string
    }
  }
}

export default function useConnectedAppConfig() {
  const [connectedAppConfig, setConnectedAppConfig] =
    useState<ConnectedAppConfig | null>(null)

  useEffect(() => {
    function callback(data: ConnectedAppConfig) {
      setConnectedAppConfig(data)
    }

    WalletUtils.ready(callback)
  }, [])

  const appScopes = parseScopes(
    connectedAppConfig?.config?.services?.["OpenID.scopes"]
  )

  return {connectedAppConfig, appScopes}
}
