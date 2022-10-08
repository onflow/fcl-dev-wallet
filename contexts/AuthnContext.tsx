import useConfig from "hooks/useConfig"
import useConnectedAppConfig, {
  ConnectedAppConfig,
} from "hooks/useConnectedAppConfig"
import React, {createContext, useEffect, useState} from "react"
import {initializeWallet} from "src/init"
import {Err} from "../src/comps/err.comp"
import {Loading} from "../components/Loading"

type AuthnContextType = {
  connectedAppConfig: ConnectedAppConfig
  appScopes: string[]
  initError: string | null
}

export const AuthnContext = createContext<AuthnContextType>({
  connectedAppConfig: {} as ConnectedAppConfig,
  appScopes: [],
  initError: null,
})

export function AuthnContextProvider({children}: {children: React.ReactNode}) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const {connectedAppConfig, appScopes} = useConnectedAppConfig()
  const config = useConfig()
  const isLoading = !isInitialized || !connectedAppConfig

  useEffect(() => {
    async function initialize() {
      try {
        await initializeWallet(config)
        setIsInitialized(true)
      } catch (error) {
        setError(`Dev wallet initialization failed: ${error}`)
      }
    }

    initialize()
  }, [])

  if (error) return <Err error={error} />
  if (isLoading) return <Loading />

  const value = {connectedAppConfig, appScopes, initError: error}

  return <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
}
