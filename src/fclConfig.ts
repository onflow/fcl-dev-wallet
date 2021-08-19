import {config} from "@onflow/fcl"

export default function fclConfig(
  flowAccessNode: string,
  flowAccountAddress: string
) {
  config()
    .put("accessNode.api", flowAccessNode)
    .put("0xSERVICE", flowAccountAddress)
}
