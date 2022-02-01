import {config} from "@onflow/fcl"
import {send as grpcSend} from "@onflow/transport-grpc"

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
    .put("sdk.transport", grpcSend)
}
