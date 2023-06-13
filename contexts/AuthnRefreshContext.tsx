import React, {createContext, useEffect, useState} from "react"
import {parseScopes} from "src/scopes"
import {useFclData} from "hooks/useFclData"

type AuthnRefreshContextType = {
  address: string
  keyId: number
  scopes: Set<string>
  nonce: string | undefined
  appIdentifier: string | undefined
} | null

export const AuthnRefreshContext = createContext<AuthnRefreshContextType>(null)

export function AuthnRefreshContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const fclData: any = useFclData()
  const [value, setValue] = useState<any>(null)

  useEffect(() => {
    if (fclData) {
      const {timestamp, appDomainTag} = fclData.body

      const service = fclData.service
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
  }, [fclData])

  return (
    <AuthnRefreshContext.Provider value={value}>
      {children}
    </AuthnRefreshContext.Provider>
  )
}
