/** @jsxImportSource theme-ui */
import getConfig from "next/config"
import {AuthnRefreshContextProvider} from "contexts/AuthnRefreshContext"
import useAuthnRefreshContext from "hooks/useAuthnRefreshContext"
import {refreshAuthn} from "src/accountAuth"
import Dialog from "components/Dialog"

function AuthnRefreshDialog({
  flowAccountPrivateKey,
}: {
  flowAccountPrivateKey: string,
}) {
  const data = useAuthnRefreshContext()

  if (data) {
    const { 
      address,
      keyId,
      scopes,
      timestamp,
      appDomainTag
    } = data;

    refreshAuthn(
      flowAccountPrivateKey,
      address,
      keyId,
      scopes,
      timestamp,
      appDomainTag
    )
  }

  // TODO: improve UI
  // e.g. add prompt to confirm reauthentication
  return (
    <Dialog root={true}>
      Refreshing...
    </Dialog>
  )
}

function AuthnRefresh({
  flowAccountPrivateKey,
}: {
  flowAccountPrivateKey: string
}) {
  return (
    <AuthnRefreshContextProvider>
      <AuthnRefreshDialog flowAccountPrivateKey={flowAccountPrivateKey} />
    </AuthnRefreshContextProvider>
  )
}

AuthnRefresh.getInitialProps = async () => {
  const {publicRuntimeConfig} = getConfig()

  return {
    flowAccountPrivateKey: publicRuntimeConfig.flowAccountPrivateKey,
  }
}

export default AuthnRefresh
