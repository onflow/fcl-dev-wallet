import useConnectedAppConfig, {
  ConnectedAppConfig,
} from "hooks/useConnectedAppConfig"
import React, {createContext} from "react"
import {paths} from "src/constants"
import useSwr from "swr"

type AppContextType = {
  connectedAppConfig: ConnectedAppConfig
  scopes: string[]
  isInit: boolean
}

export const AppContext = createContext<AppContextType>({
  connectedAppConfig: {} as ConnectedAppConfig,
  scopes: [],
  isInit: false,
})

export function AppContextProvider({children}: {children: React.ReactNode}) {
  const isInit = useSwr<boolean>(paths.apiIsInit)
  const {connectedAppConfig, scopes} = useConnectedAppConfig()

  if (isInit.data == null) return <div>... Null Data ...</div>
  if (!connectedAppConfig) return <div>... Null Config ...</div>

  const value = {connectedAppConfig, scopes, isInit: isInit.data}
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
