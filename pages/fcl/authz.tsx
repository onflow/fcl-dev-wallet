import AuthzActions from "components/AuthzActions"
import AuthzDetails from "components/AuthzDetails"
import AuthzHeader from "components/AuthzHeader"
import Code from "components/Code"
import Dialog from "components/Dialog"
import {AuthzContextProvider} from "contexts/AuthzContext"
import useAuthzContext from "hooks/useAuthzContext"

function AuthzContent() {
  const {codePreview} = useAuthzContext()

  if (!!codePreview)
    return <Code title={codePreview.title} value={codePreview.value} />
  return (
    <>
      <AuthzHeader />
      <AuthzDetails />
      <AuthzActions />
    </>
  )
}

export default function Authz() {
  return (
    <AuthzContextProvider>
      <Dialog>
        <AuthzContent />
      </Dialog>
    </AuthzContextProvider>
  )
}
