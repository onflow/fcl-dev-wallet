import {WalletUtils} from "@onflow/fcl"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import getConfig from "next/config"
import {Account} from "pages/api/accounts"
import {paths} from "src/constants"
import {buildServices} from "./services"

const {publicRuntimeConfig} = getConfig()

export async function chooseAccount(
  account: Account,
  scopes: Set<string>,
  connectedAppConfig: ConnectedAppConfig
) {
  const {address, keyId} = account

  const {timestamp, appDomainTag} = connectedAppConfig.body
  const signable = {address, keyId, timestamp, appDomainTag}

  const compSig = await fetch(paths.proveAuthn, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(signable),
  })
    .then(d => d.json())
    .then(async ({addr, keyId, signature}) => {
      return new WalletUtils.CompositeSignature(addr, keyId, signature)
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error("FCL-DEV-WALLET FAILED TO SIGN", e)
    })

  const services = buildServices({
    baseUrl: publicRuntimeConfig.baseUrl,
    address,
    timestamp,
    scopes,
    compSig,
    appDomainTag,
    keyId,
  })

  localStorage.setItem("connectedAppConfig", JSON.stringify(connectedAppConfig))

  WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", {
    addr: address,
    services,
  })
}
