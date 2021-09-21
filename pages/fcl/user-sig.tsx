/** @jsxImportSource theme-ui */
import {WalletUtils} from "@onflow/fcl"
import AuthzActions from "components/AuthzActions"
import AuthzDetailsTable, {AuthzDetailsRow} from "components/AuthzDetailsTable"
import Dialog from "components/Dialog"
import {useEffect, useState} from "react"
import {paths} from "src/constants"
import {Box, Themed} from "theme-ui"

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

export default function UserSign() {
  const [isLoading, setIsLoading] = useState(false)
  const [signable, setSignable] = useState<AuthReadyResponseSignable | null>(
    null
  )

  useEffect(() => {
    function callback(data: AuthReadyResponseData) {
      setSignable(data.body)
    }

    WalletUtils.onMessageFromFCL("FCL:VIEW:READY:RESPONSE", callback)
    WalletUtils.sendMsgToFCL("FCL:VIEW:READY")
  }, [])

  function onApprove() {
    setIsLoading(true)
    fetch(paths.userSig, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(signable),
    })
      .then(d => d.json())
      .then(({addr, keyId, signature}) => {
        WalletUtils.approve(
          new WalletUtils.CompositeSignature(addr, keyId, signature)
        )
        setIsLoading(false)
      })
      .catch(d => {
        // eslint-disable-next-line no-console
        console.error("FCL-DEV-WALLET FAILED TO SIGN", d)
        setIsLoading(false)
      })
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
          isLoading={isLoading}
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
