import React, {createContext, useEffect, useState} from "react"
import fclConfig from "src/fclConfig"

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

  const result = {
    flowAccountAddress: "0xf8d6e0586b0a20c7",
    flowAccountPrivateKey:
      "f8e188e8af0b8b414be59c4a1a15cc666c898fb34d94156e9b51e18bfde754a5",
    flowAccountPublicKey:
      "6e70492cb4ec2a6013e916114bc8bf6496f3335562f315e18b085c19da659bdfd88979a5904ae8bd9b4fd52a07fc759bad9551c04f289210784e7b08980516d2",
    flowAccountKeyId: "0",
    flowAccessNode: "http://emulator:8888",
    baseUrl: "http://localhost:8701",
    contractFungibleToken: "0xee82856bf20e2aa6",
    contractFlowToken: "0x0ae53cb6e3f42a79",
    contractFUSD: "0xf8d6e0586b0a20c7",
    contractFCLCrypto: "0xf8d6e0586b0a20c7",
    avatarUrl: "",
    flowInitAccountsNo: 0,
  }
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

  if (!config) return null

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
