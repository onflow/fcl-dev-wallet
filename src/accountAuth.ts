import {WalletUtils} from "@onflow/fcl"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import {Account} from "src/accounts"
import {sign} from "src/crypto"
import getConfig from "next/config"
import {buildServices} from "./services"

type AccountProofData = {
  address: string
  nonce: string | undefined
  appIdentifier: string | undefined
}

const {publicRuntimeConfig} = getConfig()

const getSignature = (key: string, accountProofData: AccountProofData) => {
  return sign(key, WalletUtils.encodeAccountProof(accountProofData))
}

function proveAuthn(
  flowAccountPrivateKey: string,
  address: string,
  keyId: number,
  nonce: string | undefined,
  appIdentifier: string | undefined
) {
  return {
    addr: address,
    keyId: keyId,
    signature: getSignature(flowAccountPrivateKey, {
      address,
      nonce,
      appIdentifier,
    }),
  }
}

export function refreshAuthn(
  flowAccountPrivateKey: string,
  address: string,
  keyId: number,
  scopes: Set<string>,
  nonce: string | undefined,
  appIdentifier: string | undefined
) {
  const signature = getSignature(flowAccountPrivateKey, {
    address,
    nonce,
    appIdentifier,
  })

  const compSig = new WalletUtils.CompositeSignature(address, keyId, signature)

  const services = buildServices({
    baseUrl: publicRuntimeConfig.baseUrl,
    address,
    nonce,
    scopes,
    compSig,
    keyId,
    includeRefresh: false,
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

  const {nonce, appIdentifier} = connectedAppConfig.body

  let compSig
  if (nonce) {
    const {addr, signature} = proveAuthn(
      flowAccountPrivateKey,
      address,
      keyId!,
      nonce,
      appIdentifier
    )
    compSig = new WalletUtils.CompositeSignature(addr, keyId, signature)
  }

  const services = buildServices({
    baseUrl: publicRuntimeConfig.baseUrl,
    address,
    nonce,
    scopes,
    compSig,
    keyId,
    includeRefresh: false,
  })

  localStorage.setItem("connectedAppConfig", JSON.stringify(connectedAppConfig))

  WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", {
    addr: address,
    services,
  })
}
