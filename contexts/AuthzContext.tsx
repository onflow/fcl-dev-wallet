import * as fcl from "@onflow/fcl"
import useAccounts from "hooks/useAccounts"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import {Account} from "pages/api/accounts"
import React, {createContext, useEffect, useMemo, useState} from "react"
import reply from "src/reply"

type AuthReadyData = {
  jsonrpc: string
  method: string
  params: AuthParams
  signable: unknown
  id: string
}

type AuthParams = [AuthSignable, unknown]

export type ProposalKey = {
  address: string
  keyId: number
  sequenceNum: number
}

type AuthSignable = {
  addr: string
  args: string[]
  cadence: string
  f_type: "Signable"
  f_vsn: string
  keyId: number
  message: string
  roles: Record<string, boolean>
  interaction: unknown
  voucher: {
    arguments: string[]
    authorizers: string[]
    cadence: string
    computeLimit: number
    payer: string
    payloadSigs: string[]
    proposalKey: ProposalKey
    refBlock: string
  }
}

type CodePreview = {
  title: string
  value: string
}

type AuthzContextType = {
  currentUser: Account
  proposer: Account
  payer: Account
  authorizers: Account[]
  roles: Record<string, boolean>
  proposalKey: ProposalKey
  args: string[]
  cadence: string
  computeLimit: number
  refBlock: string
  message: string
  id: string
  codePreview: CodePreview | null
  setCodePreview: React.Dispatch<React.SetStateAction<CodePreview | null>>
  isExpanded: boolean
  connectedAppConfig: ConnectedAppConfig | undefined
}

export const AuthzContext = createContext<AuthzContextType>({
  currentUser: {} as Account,
  proposer: {} as Account,
  payer: {} as Account,
  authorizers: [],
  roles: {},
  proposalKey: {
    address: "",
    keyId: 0,
    sequenceNum: 0,
  },
  args: [],
  cadence: "",
  computeLimit: 0,
  refBlock: "",
  message: "",
  id: "",
  codePreview: null,
  setCodePreview: () => null,
  isExpanded: false,
  connectedAppConfig: undefined,
})

export function AuthzContextProvider({children}: {children: React.ReactNode}) {
  const [signable, setSignable] = useState<AuthSignable | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [codePreview, setCodePreview] = useState<CodePreview | null>(null)

  const {data: accountsData} = useAccounts()

  useEffect(() => {
    function callback({data}: {data: AuthReadyData}) {
      if (data == null) return
      if (data.jsonrpc != "2.0") return
      if (data.method != "fcl:sign") return
      const [signable] = data.params
      delete signable.interaction
      setId(data.id)
      setSignable(signable)
    }

    window.addEventListener("message", callback)

    reply("FCL:FRAME:READY")

    return () => window.removeEventListener("message", callback)
  }, [])

  const accounts = useMemo(() => {
    if (!accountsData) return {}
    const hash: Record<string, Account> = {}
    accountsData.forEach(account => (hash[account.address] = account))
    return hash
  }, [accountsData])

  if (!signable || !id || Object.entries(accounts).length === 0) return null

  const {addr: currentUserAddress, voucher, roles, message} = signable
  const savedConnectedAppConfig = localStorage.getItem("connectedAppConfig")
  const value = {
    currentUser: accounts[fcl.withPrefix(currentUserAddress)],
    proposer: accounts[fcl.withPrefix(voucher.proposalKey.address)],
    payer: accounts[fcl.withPrefix(voucher.payer)],
    authorizers: voucher.authorizers.map(
      authorizer => accounts[fcl.withPrefix(authorizer)]
    ),
    roles,
    proposalKey: voucher.proposalKey,
    args: voucher.arguments,
    cadence: voucher.cadence,
    computeLimit: voucher.computeLimit,
    refBlock: voucher.refBlock,
    message,
    id,
    codePreview,
    setCodePreview,
    isExpanded: codePreview !== null,
    connectedAppConfig: savedConnectedAppConfig
      ? JSON.parse(savedConnectedAppConfig)
      : undefined,
    appTitle: "Test Harness",
    appIcon: "https://placekitten.com/g/200/200",
  }

  return <AuthzContext.Provider value={value}>{children}</AuthzContext.Provider>
}
