/** @jsxImportSource theme-ui */

import {AuthnRefreshContextProvider} from "contexts/AuthnRefreshContext"
import useAuthnRefreshContext from "hooks/useAuthnRefreshContext"
import {refreshAuthn} from "src/accountAuth"
import Dialog from "components/Dialog"
import {fetchConfigFromAPI} from "contexts/ConfigContext"

function AuthnRefreshDialog({
  flowAccountPrivateKey,
}: {
  flowAccountPrivateKey: string
}) {
  const data = useAuthnRefreshContext()

  if (data) {
    const {address, keyId, scopes, timestamp, appDomainTag} = data

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
  return <Dialog root={true}>Refreshing...</Dialog>
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
  const {flowAccountPrivateKey} = await fetchConfigFromAPI()

  return {
    flowAccountPrivateKey: flowAccountPrivateKey,
  }
}

export default AuthnRefresh
