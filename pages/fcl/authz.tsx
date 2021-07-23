import AuthzActions from "components/AuthzActions"
import AuthzDetails from "components/AuthzDetails"
import AuthzHeader from "components/AuthzHeader"
import {AuthzContextProvider} from "contexts/AuthzContext"

export default function Authz() {
  return (
    <div>
      <AuthzContextProvider>
        <AuthzHeader />
        <AuthzDetails />
        <AuthzActions />
      </AuthzContextProvider>
    </div>
  )
}
