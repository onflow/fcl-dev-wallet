import {WalletUtils} from "@onflow/fcl"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import {Account} from "src/accounts"
import {sign} from "src/crypto"
import {buildServices} from "./services"
import {getAuthId, isBackchannel} from "./utils"

type AccountProofData = {
  address: string
  nonce: string | undefined
  appIdentifier: string | undefined
}

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

export async function refreshAuthn(
  baseUrl: string,
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
    baseUrl,
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
  baseUrl: string,
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
    baseUrl,
    address,
    nonce,
    scopes,
    compSig,
    keyId,
    includeRefresh: false,
  })

  localStorage.setItem("connectedAppConfig", JSON.stringify(connectedAppConfig))

  const data = {
    addr: address,
    services,
  }

  if (isBackchannel()) {
    const body = {
      id: getAuthId(),
      data: {
        f_type: "PollingResponse",
        f_vsn: "1.0.0",
        status: "APPROVED",
        data,
      },
    }
    await fetch(baseUrl + "/api/auth-session", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  } else {
    WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", data)
  }
}
