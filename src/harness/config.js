import * as fcl from "@onflow/fcl"
import {send as grpcSend} from "@onflow/transport-grpc"

const USE_LOCAL = true

// prettier-ignore
fcl.config()
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("service.OpenID.scopes", "email")
  .put("fcl.appDomainTag", "harness-app")
  .put("sdk.transport", grpcSend)

if (USE_LOCAL) {
  // prettier-ignore
  fcl.config()
    .put("flow.network", "local")
    .put("env", "local")
    .put("accessNode.api", "http://localhost:8080")
    .put("discovery.wallet", "http://localhost:8701/fcl/authn")
} else {
  // prettier-ignore
  fcl.config()
    .put("flow.network", "testnet")
    .put("env", "testnet")
    .put("accessNode.api", "https://access-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
}
