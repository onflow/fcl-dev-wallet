import {AppContext} from "contexts/AppContext"
import {useContext} from "react"

const useAppContext = () => {
  return useContext(AppContext)
}

export default useAppContext
