import * as fcl from "@onflow/fcl"

const USE_LOCAL = true

// prettier-ignore
fcl.config()
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("service.OpenID.scopes", "email")
  .put("fcl.appDomainTag", "harness-app")

if (USE_LOCAL) {
  // prettier-ignore
  fcl.config()
    .put("flow.network", "local")
    .put("env", "local")
    .put("accessNode.api", "http://localhost:8888")
    .put("discovery.wallet", "http://localhost:8701/fcl/authn")
} else {
  // prettier-ignore
  fcl.config()
    .put("flow.network", "testnet")
    .put("env", "testnet")
    .put("accessNode.api", "https://access-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
}
