import {ConfigContext} from "contexts/ConfigContext"
import {useContext} from "react"

const useConfig = () => {
  return useContext(ConfigContext)
}

export default useConfig
