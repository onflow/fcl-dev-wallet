import {config} from "@onflow/fcl"

export default function fclConfig(
  flowAccessNode: string,
  flowAccountAddress: string,
  contractFungibleToken: string,
  contractFlowToken: string,
  contractFUSD: string
) {
  config()
    .put("accessNode.api", flowAccessNode)
    .put("0xSERVICE", flowAccountAddress)
    .put("0xFUNGIBLETOKENADDRESS", contractFungibleToken)
    .put("0xFLOWTOKENADDRESS", contractFlowToken)
    .put("0xFUSDADDRESS", contractFUSD)
}
