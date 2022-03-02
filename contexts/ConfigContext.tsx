import React, {createContext, useEffect, useState} from "react"

interface RuntimeConfig {
  flowAccountAddress?: string
  flowAccountPrivateKey?: string
  flowAccountPublicKey?: string
  flowAccountKeyId?: string
  flowAccessNode?: string
}

export const ConfigContext = createContext<RuntimeConfig>({})

function fetchConfigFromAPI(): Promise<RuntimeConfig> {
  return fetch("http://localhost:8701/api/")
    .then(res => res.json())
    .catch(e => {
      throw new Error(
        `Failed to fetch config from API. Are you sure the dev-web-server is running on port 8701?
            ${e}
          `
      )
    })
}

export function ConfigContextProvider({children}) {
  const [config, setConfig] = useState<RuntimeConfig>({})

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
