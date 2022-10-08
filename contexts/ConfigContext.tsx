import React, {createContext, useEffect, useState} from "react"
import fclConfig from "src/fclConfig"
import {Loading} from "../components/Loading"

interface RuntimeConfig {
  avatarUrl: string
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
}

const defaultConfig = {
  avatarUrl: process.env.avatarUrl || "",
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
}

export const ConfigContext = createContext<RuntimeConfig>(defaultConfig)

async function getConfig(): Promise<RuntimeConfig> {
  if (process.env.isLocal) {
    return defaultConfig
  }

  const result = await fetch("http://localhost:8701/api/")
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

  return result
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

  if (!config) return <Loading />

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
