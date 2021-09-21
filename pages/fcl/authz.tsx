/** @jsxImportSource theme-ui */
import AuthzActions from "components/AuthzActions"
import AuthzDetails from "components/AuthzDetails"
import AuthzHeader from "components/AuthzHeader"
import Code from "components/Code"
import Dialog from "components/Dialog"
import {AuthzContextProvider} from "contexts/AuthzContext"
import useAuthzContext from "hooks/useAuthzContext"
import {useState} from "react"
import {paths} from "src/constants"
import {WalletUtils} from "@onflow/fcl"
import getConfig from "next/config"

function AuthzContent({
  flowAccountAddress,
  avatarUrl,
}: {
  flowAccountAddress: string
  avatarUrl: string
}) {
  const {isExpanded, codePreview} = useAuthzContext()
  const {currentUser, proposalKey, message} = useAuthzContext()
  const [isLoading, setIsLoading] = useState(false)

  const onApprove = () => {
    setIsLoading(true)
    fetch(paths.apiSign, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: message}),
    })
      .then(d => d.json())
      .then(({signature}) => {
        WalletUtils.approve(
          new WalletUtils.CompositeSignature(
            currentUser.address,
            proposalKey.keyId,
            signature
          )
        )
        setIsLoading(false)
      })
      .catch(d => {
        // eslint-disable-next-line no-console
        console.error("FCL-DEV-WALLET FAILED TO SIGN", d)
        setIsLoading(false)
      })
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
  flowAccountAddress,
  avatarUrl,
}: {
  flowAccountAddress: string
  avatarUrl: string
}) {
  return (
    <AuthzContextProvider>
      <AuthzContent
        flowAccountAddress={flowAccountAddress}
        avatarUrl={avatarUrl}
      />
    </AuthzContextProvider>
  )
}

Authz.getInitialProps = async () => {
  const {publicRuntimeConfig} = getConfig()

  return {
    flowAccountAddress: publicRuntimeConfig.flowAccountAddress,
    avatarUrl: publicRuntimeConfig.avatarUrl,
  }
}

export default Authz
