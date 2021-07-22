import useConnectedAppConfig, {
  ConnectedAppConfig,
} from "hooks/useConnectedAppConfig"
import React, {createContext} from "react"
import {paths} from "src/constants"
import useSwr from "swr"

type AppContextType = {
  connectedAppConfig: ConnectedAppConfig
  appScopes: string[]
  isInit: boolean
}

export const AppContext = createContext<AppContextType>({
  connectedAppConfig: {} as ConnectedAppConfig,
  appScopes: [],
  isInit: false,
})

export function AppContextProvider({children}: {children: React.ReactNode}) {
  const isInit = useSwr<boolean>(paths.apiIsInit)
  const {connectedAppConfig, appScopes} = useConnectedAppConfig()

  if (isInit.data == null) return <div>... Null Data ...</div>
  if (!connectedAppConfig) return <div>... Null Config ...</div>
  const value = {connectedAppConfig, appScopes, isInit: isInit.data}
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
