import React, {createContext, useEffect, useState} from "react"
import fclConfig from "src/fclConfig"
import {Spinner} from "../components/Spinner"
import {getBaseUrl} from "src/utils"

interface RuntimeConfig {
  flowAvatarUrl: string
  contractFungibleToken: string
  contractFlowToken: string
  contractFUSD: string
  contractFCLCrypto: string
  flowAccountAddress: string
  flowAccountPrivateKey: string
  flowAccountPublicKey: string
  flowAccountKeyId: string
  flowAccessNode: string
  flowInitAccountsNo: number
  flowInitAccountBalance: string
}

const defaultConfig = {
  flowAvatarUrl: process.env.flowAvatarUrl || "",
  contractFungibleToken: process.env.contractFungibleToken || "",
  contractFlowToken: process.env.contractFlowToken || "",
  contractFUSD: process.env.contractFUSD || "",
  contractFCLCrypto: process.env.contractFCLCrypto || "",
  flowAccountAddress: process.env.flowAccountAddress || "",
  flowAccountPrivateKey: process.env.flowAccountPrivateKey || "",
  flowAccountPublicKey: process.env.flowAccountPublicKey || "",
  flowAccountKeyId: process.env.flowAccountKeyId || "",
  flowAccessNode: process.env.flowAccessNode || "",
  flowInitAccountsNo: parseInt(process.env.flowInitAccountsNo || "0") || 0,
  flowInitAccountBalance: process.env.flowInitAccountBalance || "1000.0",
}

export const ConfigContext = createContext<RuntimeConfig>(defaultConfig)

async function getConfig(): Promise<RuntimeConfig> {
  if (process.env.isLocal) {
    return replaceLocalhostWithBaseUrl(defaultConfig)
  }

  const result = await fetch("http://localhost:8701/api/")
    .then(res => res.json())
    .then(remoteConfig => {
      return Object.assign(defaultConfig, remoteConfig)
    })
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
    .then(config => replaceLocalhostWithBaseUrl(config))

  return result
}

// Replace localhost Flow Access Node with the base URL of the app
function replaceLocalhostWithBaseUrl(config: RuntimeConfig): RuntimeConfig {
  const accessNodeUrl = new URL(config.flowAccessNode)
  const {hostname} = accessNodeUrl
  const isLocalhost =
    hostname === "127.0.0.1" || hostname === "::1" || hostname === "localhost"

  if (isLocalhost) {
    accessNodeUrl.hostname = new URL(getBaseUrl()).hostname
    // Must remove trailing slash to work
    config.flowAccessNode = accessNodeUrl.href.replace(/\/$/, "")
  }

  return config
}

export function ConfigContextProvider({children}: {children: React.ReactNode}) {
  const [config, setConfig] = useState<RuntimeConfig>()

  useEffect(() => {
    async function fetchConfig() {
      const config = await getConfig()

      const {
        flowAccessNode,
        flowAccountAddress,
        contractFungibleToken,
        contractFlowToken,
        contractFUSD,
      } = config

      fclConfig(
        flowAccessNode,
        flowAccountAddress,
        contractFungibleToken,
        contractFlowToken,
        contractFUSD
      )

      setConfig(config)
    }

    fetchConfig()
  }, [])

  if (!config) return <Spinner />

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
