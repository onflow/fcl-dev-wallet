import React, {createContext, useEffect, useState} from "react"
import getConfig from "next/config"

interface RuntimeConfig {
  flowAccountAddress: string
  flowAccountPrivateKey: string
  flowAccountPublicKey: string
  flowAccountKeyId: string
  flowAccessNode: string
}

const {publicRuntimeConfig} = getConfig()

const defaultConfig = {
  flowAccountAddress: publicRuntimeConfig.flowAccountAddress || "",
  flowAccountPrivateKey: publicRuntimeConfig.flowAccountPrivateKey || "",
  flowAccountPublicKey: publicRuntimeConfig.flowAccountPublicKey || "",
  flowAccountKeyId: publicRuntimeConfig.flowAccountKeyId || "",
  flowAccessNode: publicRuntimeConfig.flowAccessNode || "",
}

export const ConfigContext = createContext<RuntimeConfig>(defaultConfig)

export async function fetchConfigFromAPI(): Promise<RuntimeConfig> {
  if (publicRuntimeConfig.isLocal) {
    return defaultConfig
  }

  return fetch("http://localhost:8701/api/")
    .then(res => res.json())
    .catch(e => {
      console.log(
        `Warning: Failed to fetch config from API. 
         If you see this warning during CI you can ignore it.
         Returning default config.
         ${e}
          `
      )
      return defaultConfig
    })
}

export function ConfigContextProvider({children}: {children: React.ReactNode}) {
  const [config, setConfig] = useState<RuntimeConfig>()

  useEffect(() => {
    async function fetchConfig() {
      const config = await fetchConfigFromAPI()
      setConfig(config)
    }

    fetchConfig()
  }, [])

  if (!config) return null

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
