/** @jsxImportSource theme-ui */
import {WalletUtils} from "@onflow/fcl"
import AuthzActions from "components/AuthzActions"
import AuthzDetailsTable, {AuthzDetailsRow} from "components/AuthzDetailsTable"
import Dialog from "components/Dialog"
import {useEffect, useState} from "react"
import {sign} from "src/crypto"
import {Box, Themed} from "theme-ui"
import getWalletConfig from "hooks/useConfig"
import {useFclData} from "hooks/useFclData"

type AuthReadyResponseSignable = {
  data: {
    addr: string
    keyId: string
  }
  message: string
}

type AuthReadyResponseData = {
  type: string
  body: AuthReadyResponseSignable
}

function userSignature(
  signable: AuthReadyResponseSignable,
  privateKey: string
) {
  const {
    message,
    data: {addr, keyId},
  } = signable

  const rightPaddedHexBuffer = (value: string, pad: number) =>
    Buffer.from(value.padEnd(pad * 2, "0"), "hex")

  const USER_DOMAIN_TAG = rightPaddedHexBuffer(
    Buffer.from("FLOW-V0.0-user").toString("hex"),
    32
  ).toString("hex")

  const prependUserDomainTag = (msg: string) => USER_DOMAIN_TAG + msg

  return {
    addr: addr,
    keyId: keyId,
    signature: sign(privateKey, prependUserDomainTag(message)),
  }
}

export default function UserSign() {
  const {flowAccountPrivateKey} = getWalletConfig()

  const signable = useFclData<AuthReadyResponseData>()?.body

  function onApprove() {
    const {addr, keyId, signature} = userSignature(
      signable!,
      flowAccountPrivateKey
    )

    WalletUtils.approve(
      new WalletUtils.CompositeSignature(addr, keyId, signature)
    )
  }

  const onDecline = () => {
    WalletUtils.decline("User declined")
  }

  return (
    <Dialog
      footer={
        <AuthzActions
          onApprove={onApprove}
          onDecline={onDecline}
          isLoading={false}
        />
      }
    >
      <Themed.h1 sx={{textAlign: "center", mb: 0}}>Sign Message</Themed.h1>
      <Themed.p sx={{textAlign: "center", mb: 4}}>
        Please prove that you have access to this wallet.
        <br />
        This won’t cost you any FLOW.
      </Themed.p>
      <Box mb={20}>
        <AuthzDetailsTable>
          <AuthzDetailsRow>
            <td>Address</td>
            <td>{signable?.data.addr}</td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Key ID</td>
            <td>{signable?.data.keyId}</td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Message (Hex)</td>
            <td>{signable?.message}</td>
          </AuthzDetailsRow>
        </AuthzDetailsTable>
      </Box>
    </Dialog>
  )
}
