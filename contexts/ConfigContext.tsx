import React, {createContext, useEffect, useState} from "react"
import getNextConfig from "next/config"
import fclConfig from "src/fclConfig"

interface RuntimeConfig {
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
}

interface StaticConfig {
  avatarUrl: string
  flowInitAccountsNo: number
  tokenAmountFLOW: string
  tokenAmountFUSD: string
}

const {publicRuntimeConfig} = getNextConfig()

const defaultConfig = {
  baseUrl: publicRuntimeConfig.baseUrl || "",
  contractFungibleToken: publicRuntimeConfig.contractFungibleToken || "",
  contractFlowToken: publicRuntimeConfig.contractFlowToken || "",
  contractFUSD: publicRuntimeConfig.contractFUSD || "",
  contractFCLCrypto: publicRuntimeConfig.contractFCLCrypto || "",
  flowAccountAddress: publicRuntimeConfig.flowAccountAddress || "",
  flowAccountPrivateKey: publicRuntimeConfig.flowAccountPrivateKey || "",
  flowAccountPublicKey: publicRuntimeConfig.flowAccountPublicKey || "",
  flowAccountKeyId: publicRuntimeConfig.flowAccountKeyId || "",
  flowAccessNode: publicRuntimeConfig.flowAccessNode || "",
}

export const ConfigContext = createContext<RuntimeConfig>(defaultConfig)

export function getStaticConfig(): StaticConfig {
  // Should we set sensible defaults here?
  return {
    avatarUrl: publicRuntimeConfig.avatarUrl,
    flowInitAccountsNo: publicRuntimeConfig.flowInitAccountsNo,
    tokenAmountFLOW: publicRuntimeConfig.tokenAmountFLOW,
    tokenAmountFUSD: publicRuntimeConfig.tokenAmountFUSD,
  }
}

async function getConfig(): Promise<RuntimeConfig> {
  if (publicRuntimeConfig.isLocal) {
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

  return {
    ...defaultConfig,
    ...result,
  }
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

  if (!config) return null

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
