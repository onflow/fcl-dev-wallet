import {AuthzContext} from "contexts/AuthzContext"
import {useContext} from "react"

const useAuthzContext = () => {
  return useContext(AuthzContext)
}

export default useAuthzContext
