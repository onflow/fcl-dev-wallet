import React, {createContext, useEffect, useState} from "react"
import {
  CHAIN_ID_MAINNET,
  CHAIN_ID_TESTNET,
  SERVICE_ACCOUNT_MAINNET,
  SERVICE_ACCOUNT_TESTNET,
} from "src/constants"
import fclConfig from "src/fclConfig"
import {Spinner} from "../components/Spinner"
import {getBaseUrl} from "src/utils"

interface RuntimeConfig {
  flowAvatarUrl: string
  flowAccountAddress: string
  flowAccountPrivateKey: string
  flowAccountPublicKey: string
  flowAccountKeyId: string
  flowAccessNode: string
  flowInitAccountsNo: number
  flowInitAccountBalance: string
  forkMode: boolean
}

const defaultConfig = {
  flowAvatarUrl: process.env.flowAvatarUrl || "",
  flowAccountAddress: process.env.flowAccountAddress || "",
  flowAccountPrivateKey: process.env.flowAccountPrivateKey || "",
  flowAccountPublicKey: process.env.flowAccountPublicKey || "",
  flowAccountKeyId: process.env.flowAccountKeyId || "",
  flowAccessNode: process.env.flowAccessNode || "",
  flowInitAccountsNo: parseInt(process.env.flowInitAccountsNo || "0") || 0,
  flowInitAccountBalance: process.env.flowInitAccountBalance || "1000.0",
  forkMode: false,
}

export const ConfigContext = createContext<RuntimeConfig>(
  defaultConfig as RuntimeConfig
)

function detectForkAndOverride(
  config: RuntimeConfig,
  chainId: string | null
): RuntimeConfig {
  const isMainnet = chainId === CHAIN_ID_MAINNET
  const isTestnet = chainId === CHAIN_ID_TESTNET
  const forkMode = isMainnet || isTestnet

  if (!forkMode) return {...config, forkMode: false}

  const SERVICE_ACCOUNT_BY_CHAIN: Record<string, string> = {
    [CHAIN_ID_MAINNET]: SERVICE_ACCOUNT_MAINNET,
    [CHAIN_ID_TESTNET]: SERVICE_ACCOUNT_TESTNET,
  }

  const serviceAccount = chainId ? SERVICE_ACCOUNT_BY_CHAIN[chainId] : null

  return {
    ...config,
    forkMode: true,
    // Force service account to known network service account in fork mode
    flowAccountAddress: serviceAccount || config.flowAccountAddress,
  }
}

async function getConfig(): Promise<RuntimeConfig> {
  if (process.env.isLocal) {
    const cfg = replaceAccessUrlBaseUrl(defaultConfig as RuntimeConfig)
    return cfg as RuntimeConfig
  }

  const result = await fetch(`${getBaseUrl()}/api/`)
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
    .then(config => replaceAccessUrlBaseUrl(config))

  return result
}

// Replace localhost Flow Access Node with the base URL of the app
function replaceAccessUrlBaseUrl(config: RuntimeConfig): RuntimeConfig {
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
      const {flowAccessNode} = config
      const chainId = await fclConfig(flowAccessNode)
      const finalized = detectForkAndOverride(config, chainId)
      setConfig(finalized)
    }

    fetchConfig()
  }, [])

  if (!config) return <Spinner />

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
