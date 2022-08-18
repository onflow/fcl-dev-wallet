import * as fcl from "@onflow/fcl"
import useAccounts from "hooks/useAccounts"
import {ConnectedAppConfig} from "hooks/useConnectedAppConfig"
import {Account} from "src/accounts"
import React, {createContext, useEffect, useMemo, useState} from "react"
import {WalletUtils} from "@onflow/fcl"

type AuthzReadyData = {
  type: string
  body: AuthSignable
  service: Record<string, unknown>
  config: {
    services: {"OpenID.scopes": string}
    app: {
      icon: string
      title: string
    }
  }
}

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
  codePreview: null,
  setCodePreview: () => null,
  isExpanded: false,
  connectedAppConfig: undefined,
})

const AUDIT_RESOLVERS = [
  async (template: any) => {
    return await fetch(`http://localhost:3030/audits/${template?.id}`)
        .then(response => response.json())
        .catch(e => null)
  },
  async (template: any) => {
    return await fetch(`/api/audit/${template?.id}`)
        .then(response => response.json())
        .catch(e => null)
  }
]

export function AuthzContextProvider({children}: {children: React.ReactNode}) {
  const [signable, setSignable] = useState<AuthSignable | null>(null)
  const [template, setTemplate] = useState(null)
  const [isAudited, setIsAudited] = useState<Boolean>(false)
  const [codePreview, setCodePreview] = useState<CodePreview | null>(null)

  const {data: accountsData} = useAccounts()

  useEffect(() => {
    async function callback(data: AuthzReadyData) {
      setSignable(data.body)

      const template = data.body?.voucher?.template

      if (!template) return

      let audits = 
        (await Promise.all(AUDIT_RESOLVERS.map(async auditResolver => auditResolver(template)))).filter(a => a !== null)
      let audit = audits[0]

      if (!audit) {
        setIsAudited(false)
        return
      }

      let verifiedAudit = await fcl.InteractionTemplateUtils.verifyInteractionTemplateAudit({
        template,
        audit,
      })

      let areTemplateDependenciesSame = 
        await fcl.InteractionTemplateUtils.verifyDependencyPinsSameAtLatestSealedBlock({
          template,
          networks: ["emulator"]
        })

      setIsAudited(verifiedAudit && areTemplateDependenciesSame)
      if (verifiedAudit && areTemplateDependenciesSame) {
        setTemplate(template)
      }
    }

    WalletUtils.ready(callback)
  }, [])

  const accounts = useMemo(() => {
    if (!accountsData) return {}
    const hash: Record<string, Account> = {}
    accountsData.forEach(account => (hash[account.address] = account))
    return hash
  }, [accountsData])

  if (!signable || Object.entries(accounts).length === 0) return null

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
    codePreview,
    setCodePreview,
    isExpanded: codePreview !== null,
    connectedAppConfig: savedConnectedAppConfig
      ? JSON.parse(savedConnectedAppConfig)
      : undefined,
    appTitle: "Test Harness",
    appIcon: "https://placekitten.com/g/200/200",
    isAudited,
    template,
  }

  return <AuthzContext.Provider value={value}>{children}</AuthzContext.Provider>
}
