import {AuthnContext} from "contexts/AuthnContext"
import {useContext} from "react"

const useAuthnContext = () => {
  return useContext(AuthnContext)
}

export default useAuthnContext
