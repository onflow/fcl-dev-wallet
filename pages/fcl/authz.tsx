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
import {getStaticConfig} from "../../contexts/ConfigContext"

function AuthzContent({
  flowAccountAddress,
  flowAccountPrivateKey,
  avatarUrl,
}: {
  flowAccountAddress: string
  flowAccountPrivateKey: string
  avatarUrl: string
}) {
  const {isExpanded, codePreview} = useAuthzContext()
  const {currentUser, proposalKey, message} = useAuthzContext()
  const [isLoading, setIsLoading] = useState(false)

  const onApprove = () => {
    setIsLoading(true)

    const signature = sign(flowAccountPrivateKey, message)

    WalletUtils.approve(
      new WalletUtils.CompositeSignature(
        currentUser.address,
        proposalKey.keyId,
        signature
      )
    )
  }

  const onDecline = () => WalletUtils.close()

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

function Authz({
  avatarUrl,
}: {
  flowAccountAddress: string
  flowAccountPrivateKey: string
  avatarUrl: string
}) {
  const {flowAccountAddress, flowAccountPrivateKey} = useConfig()
  return (
    <AuthzContextProvider>
      <AuthzContent
        flowAccountAddress={flowAccountAddress}
        flowAccountPrivateKey={flowAccountPrivateKey}
        avatarUrl={avatarUrl}
      />
    </AuthzContextProvider>
  )
}

Authz.getInitialProps = async () => {
  const {avatarUrl} = getStaticConfig()

  return {
    avatarUrl,
  }
}

export default Authz
