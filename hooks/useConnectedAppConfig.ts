import {useEffect, useState} from "react"

export type ConnectedAppConfig = {
  app: {
    icon: string
    title: string
  }
  services: {"OpenID.scopes": string}
  type: string
}

export default function useAppConfig() {
  const [connectedAppConfig, setConnectedAppConfig] =
    useState<ConnectedAppConfig | null>(null)

  useEffect(() => {
    function callback(e: {data: ConnectedAppConfig}) {
      if (typeof e.data !== "object") return
      if (e.data.type !== "FCL:AUTHN:CONFIG") return
      setConnectedAppConfig(e.data)
    }

    window.addEventListener("message", callback)
    window.parent.postMessage({type: "FCL:FRAME:READY"}, "*")

    return () => {
      window.removeEventListener("message", callback)
    }
  }, [])

  const appScopes =
    connectedAppConfig?.services?.["OpenID.scopes"]?.trim()?.split(/\s+/) ?? []

  return {connectedAppConfig, appScopes}
}
