/** @jsxImportSource theme-ui */

import {AuthnRefreshContextProvider} from "contexts/AuthnRefreshContext"
import useAuthnRefreshContext from "hooks/useAuthnRefreshContext"
import {refreshAuthn} from "src/accountAuth"
import Dialog from "components/Dialog"
import useConfig from "hooks/useConfig"
import {getBaseUrl} from "src/utils"

function AuthnRefreshDialog() {
  const data = useAuthnRefreshContext()
  const baseUrl = getBaseUrl()
  const {flowAccountPrivateKey} = useConfig()

  if (data) {
    const {address, keyId, scopes, nonce, appIdentifier} = data

    refreshAuthn(
      baseUrl,
      flowAccountPrivateKey,
      address,
      keyId,
      scopes,
      nonce,
      appIdentifier
    )
  }

  // TODO: improve UI
  // e.g. add prompt to confirm reauthentication
  return <Dialog root={true}>Refreshing...</Dialog>
}

function AuthnRefresh() {
  return (
    <AuthnRefreshContextProvider>
      <AuthnRefreshDialog />
    </AuthnRefreshContextProvider>
  )
}

export default AuthnRefresh
