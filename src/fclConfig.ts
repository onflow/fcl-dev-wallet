import * as fcl from "@onflow/fcl"
import flowJSON from "../flow.json"

function setContractAliases(chainId: string) {
  const sources = [flowJSON.contracts, flowJSON.dependencies]

  sources.forEach(source => {
    if (!source) return
    Object.entries(source).forEach(([name, config]: [string, any]) => {
      const address = config.aliases?.[chainId]
      if (address) {
        // Ensure address has 0x prefix
        const prefixedAddress = address.startsWith("0x")
          ? address
          : `0x${address}`
        fcl.config().put(`0x${name}`, prefixedAddress)
      }
    })
  })
}

export default async function fclConfig(
  flowAccessNode: string
): Promise<string | null> {
  fcl.config().put("accessNode.api", flowAccessNode)

  let chainId: string | null = null
  try {
    chainId = await (fcl as any).getChainId()
  } catch (e) {
    // If getChainId fails, chainId remains null
    console.warn("Failed to get chain ID from network", e)
  }

  if (chainId) {
    fcl.config().put("flow.network", chainId)
    setContractAliases(chainId)
  }

  return chainId
}
