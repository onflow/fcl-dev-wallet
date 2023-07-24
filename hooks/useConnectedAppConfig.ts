import {parseScopes} from "src/scopes"
import {useFclData} from "./useFclData"

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
    client?: {
      platform?: string
    }
  }
}

export default function useConnectedAppConfig() {
  const connectedAppConfig = useFclData<ConnectedAppConfig | null>({
    transformBackchannel: data => {
      const {appIdentifier, nonce, ...restData} = data
      return {
        ...restData,
        body: {
          appIdentifier: appIdentifier,
          nonce: nonce,
        },
      }
    },
  })

  const appScopes = parseScopes(
    connectedAppConfig?.config?.services?.["OpenID.scopes"]
  )

  return {connectedAppConfig, appScopes}
}
