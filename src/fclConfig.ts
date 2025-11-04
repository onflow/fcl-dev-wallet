import * as fcl from "@onflow/fcl"
import flowJSON from "../flow.json"

export default async function fclConfig(
  flowAccessNode: string
): Promise<string | null> {
  fcl.config().put("accessNode.api", flowAccessNode)

  const chainId = await fcl.getChainId()

  if (!chainId) {
    throw new Error("Failed to get chain ID from network")
  }

  fcl.config().put("flow.network", chainId)
  fcl.config().load({flowJSON})

  return chainId
}
