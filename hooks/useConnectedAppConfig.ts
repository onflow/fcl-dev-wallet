import {useEffect, useState} from "react"

export type ConnectedAppConfig = {
  app: {
    icon: string
    title: string
  }
  services: {"OpenID.scopes": string}
  type: string
}

export default function useConnectedAppConfig() {
  const [connectedAppConfig, setConnectedAppConfig] =
    useState<ConnectedAppConfig | null>(null)

  useEffect(() => {
    function callback({data}: {data: ConnectedAppConfig}) {
      if (typeof data !== "object") return
      if (data.type !== "FCL:AUTHN:CONFIG") return
      setConnectedAppConfig(data)
    }

    window.addEventListener("message", callback)
    window.parent.postMessage({type: "FCL:FRAME:READY"}, "*")

    return () => window.removeEventListener("message", callback)
  }, [])

  const appScopes =
    connectedAppConfig?.services?.["OpenID.scopes"]?.trim()?.split(/\s+/) ?? []

  return {connectedAppConfig, appScopes}
}
