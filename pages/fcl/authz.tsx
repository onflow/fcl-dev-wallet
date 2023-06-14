/** @jsxImportSource theme-ui */
import {WalletUtils} from "@onflow/fcl"
import AuthzActions from "components/AuthzActions"
import AuthzDetails from "components/AuthzDetails"
import AuthzHeader from "components/AuthzHeader"
import Code from "components/Code"
import Dialog from "components/Dialog"
import {AuthzContextProvider} from "contexts/AuthzContext"
import useConfig from "hooks/useConfig"
import useAuthzContext from "hooks/useAuthzContext"
import {useState} from "react"
import {sign} from "src/crypto"
import {getBaseUrl, isBackchannel, updatePollingSession} from "src/utils"

function AuthzContent({
  flowAccountAddress,
  flowAccountPrivateKey,
  avatarUrl,
}: {
  flowAccountAddress: string
  flowAccountPrivateKey: string
  avatarUrl: string
}) {
  const baseUrl = getBaseUrl()
  const {isExpanded, codePreview} = useAuthzContext()
  const {currentUser, proposalKey, message} = useAuthzContext()
  const [isLoading, setIsLoading] = useState(false)

  const onApprove = () => {
    setIsLoading(true)

    const signature = sign(flowAccountPrivateKey, message)

    const response = {
      f_type: "PollingResponse",
      f_vsn: "1.0.0",
      status: "APPROVED",
      reason: null,
      data: new WalletUtils.CompositeSignature(
        currentUser.address,
        proposalKey.keyId,
        signature
      ),
    }

    if (isBackchannel()) {
      updatePollingSession(baseUrl, response)
    } else {
      WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", response)
    }
  }

  const onDecline = () => {
    const declineResponse = {
      f_type: "PollingResponse",
      f_vsn: "1.0.0",
      status: "DECLINED",
      reason: "User declined",
      data: null,
    }

    if (isBackchannel()) {
      updatePollingSession(baseUrl, declineResponse)
    } else {
      WalletUtils.sendMsgToFCL("FCL:VIEW:RESPONSE", declineResponse)
    }
  }

  return (
    <Dialog
      title="Authorize Transaction"
      header={
        !isExpanded && (
          <AuthzHeader
            flowAccountAddress={flowAccountAddress}
            avatarUrl={avatarUrl}
          />
        )
      }
      footer={
        !isExpanded && (
          <AuthzActions
            onApprove={onApprove}
            isLoading={isLoading}
            onDecline={onDecline}
          />
        )
      }
    >
      {!!codePreview ? (
        <Code title={codePreview.title} value={codePreview.value} />
      ) : (
        <AuthzDetails />
      )}
    </Dialog>
  )
}

function Authz() {
  const {flowAvatarUrl, flowAccountAddress, flowAccountPrivateKey} = useConfig()
  return (
    <AuthzContextProvider>
      <AuthzContent
        flowAccountAddress={flowAccountAddress}
        flowAccountPrivateKey={flowAccountPrivateKey}
        avatarUrl={flowAvatarUrl}
      />
    </AuthzContextProvider>
  )
}

export default Authz
