import useConnectedAppConfig, {
  ConnectedAppConfig,
} from "hooks/useConnectedAppConfig"
import React, {createContext, useEffect, useState} from "react"
import {initializeWallet} from "src/init"

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

  useEffect(() => {
    async function initialize() {
      try {
        await initializeWallet()
        setIsInitialized(true)
      } catch (error) {
        setError(`Dev wallet initialization failed: ${error}`)
      }
    }

    initialize()
  }, [])

  if (!isInitialized || !connectedAppConfig) return null
  const value = {connectedAppConfig, appScopes, initError: error}

  return <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
}
