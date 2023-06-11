import React, {createContext, useEffect, useState} from "react"
import fclConfig from "src/fclConfig"
import {Spinner} from "../components/Spinner"

interface RuntimeConfig {
  flowAvatarUrl: string
  baseUrl: string
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
  baseUrl: process.env.baseUrl || "",
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
    return defaultConfig
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

  return result
}

export function ConfigContextProvider({children}: {children: React.ReactNode}) {
  const [config, setConfig] = useState<RuntimeConfig>()

  useEffect(() => {
    async function fetchConfig() {
      const config = await getConfig()

      console.log("config", config)

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
