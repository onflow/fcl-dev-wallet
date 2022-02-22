import {AuthnRefreshContext} from "contexts/AuthnRefreshContext"
import {useContext} from "react"

const useAuthnRefreshContext = () => {
  return useContext(AuthnRefreshContext)
}

export default useAuthnRefreshContext
