import React, {createContext, useEffect, useState} from "react"
import {WalletUtils} from "@onflow/fcl"
import {parseScopes} from "src/scopes"

type AuthnRefreshContextType = {
  address: string
  keyId: number
  scopes: Set<string>
  timestamp: number
  appDomainTag: string
} | null

export const AuthnRefreshContext = createContext<AuthnRefreshContextType>(null)

export function AuthnRefreshContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<any>(null)

  useEffect(() => {
    function callback(data: any) {
      const {timestamp, appDomainTag} = data.body

      const service = data.service
      const address = service?.data?.address
      const keyId = service?.data?.keyId
      const scopes = new Set(parseScopes(service?.params?.scopes))

      setValue({
        address,
        keyId,
        scopes,
        timestamp,
        appDomainTag,
      })
    }

    WalletUtils.ready(callback)
  }, [])

  return (
    <AuthnRefreshContext.Provider value={value}>
      {children}
    </AuthnRefreshContext.Provider>
  )
}
