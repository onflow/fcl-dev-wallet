import {WalletUtils} from "@onflow/fcl"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import {Account} from "src/accounts"
import {sign} from "src/crypto"
import getConfig from "next/config"
import {buildServices} from "./services"

const {publicRuntimeConfig} = getConfig()

function proveAuthn(
  flowAccountPrivateKey: string,
  address: string,
  keyId: number,
  timestamp: unknown,
  appDomainTag: unknown
) {
  return {
    addr: address,
    keyId: keyId,
    signature: sign(
      flowAccountPrivateKey,
      WalletUtils.encodeMessageForProvableAuthnSigning(
        address,
        timestamp,
        appDomainTag
      )
    ),
  }
}

export function refreshAuthn(
  flowAccountPrivateKey: string,
  address: string,
  keyId: number,
  scopes: Set<string>,
  timestamp: number,
  appDomainTag: string
) {
  const signature = sign(
    flowAccountPrivateKey,
    WalletUtils.encodeMessageForProvableAuthnSigning(
      address,
      timestamp,
      appDomainTag
    )
  )

  const compSig = new WalletUtils.CompositeSignature(
    address, 
    keyId, 
    signature
  )
  
  const services = buildServices({
    baseUrl: publicRuntimeConfig.baseUrl,
    address,
    timestamp,
    scopes,
    compSig,
    appDomainTag,
    keyId,
  })

  WalletUtils.approve({
    f_type: "AuthnResponse",
    f_vsn: "1.0.0",
    addr: address,
    services,
  })
}

export async function chooseAccount(
  flowAccountPrivateKey: string,
  account: Account,
  scopes: Set<string>,
  connectedAppConfig: ConnectedAppConfig
) {
  const {address, keyId} = account

  const {timestamp, appDomainTag} = connectedAppConfig.body

  const {addr, signature} = proveAuthn(
    flowAccountPrivateKey,
    address,
    keyId!,
    timestamp,
    appDomainTag
  )

  const compSig = new WalletUtils.CompositeSignature(addr, keyId, signature)

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
