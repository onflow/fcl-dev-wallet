/** @jsxImportSource theme-ui */
import AccountForm from "components/AccountForm"
import AccountsList from "components/AccountsList"
import AnyAccountForm from "components/AnyAccountForm"
import Dialog, {styles as dialogStyles} from "components/Dialog"
import {AuthnContextProvider} from "contexts/AuthnContext"
import useAccounts from "hooks/useAccounts"
import {Account, NewAccount} from "src/accounts"
import {useState} from "react"
import {Err} from "src/comps/err.comp"
import useConfig from "hooks/useConfig"
import {Spinner} from "../../components/Spinner"

function AuthnDialog({
  flowAccountAddress,
  flowAccountPrivateKey,
  avatarUrl,
}: {
  flowAccountAddress: string
  flowAccountPrivateKey: string
  avatarUrl: string
}) {
  const [editingAccount, setEditingAccount] = useState<
    Account | NewAccount | null
  >(null)
  const [anyAccountMode, setAnyAccountMode] = useState<boolean>(false)

  const {
    data: accounts,
    error,
    isLoading,
    refresh: refreshAccounts,
  } = useAccounts()

  const [createdAccountAddress, setCreatedAccountAddress] = useState<
    string | null
  >(null)

  const onEditAccount = (account: Account | NewAccount) => {
    setCreatedAccountAddress(null)
    setEditingAccount(account)
  }

  const onSubmitComplete = (createdAccountAddress?: string) => {
    setEditingAccount(null)
    if (createdAccountAddress) {
      setCreatedAccountAddress(createdAccountAddress)
    }
    refreshAccounts()
  }

  const onCancel = () => setEditingAccount(null)
  const onCancelAnyAccount = () => setAnyAccountMode(false)

  if (error) return <Err title="Authentication Error" error={error} />
  if (isLoading) return <Spinner />

  return (
    <Dialog root={true}>
      {editingAccount ? (
        <AccountForm
          account={editingAccount}
          onSubmitComplete={onSubmitComplete}
          onCancel={onCancel}
          flowAccountAddress={flowAccountAddress}
          avatarUrl={avatarUrl}
        />
      ) : anyAccountMode ? (
        <AnyAccountForm
          onCancel={onCancelAnyAccount}
          flowAccountAddress={flowAccountAddress}
          flowAccountPrivateKey={flowAccountPrivateKey}
          avatarUrl={avatarUrl}
        />
      ) : (
        <div sx={dialogStyles.body}>
          <AccountsList
            accounts={accounts}
            onEditAccount={onEditAccount}
            onUseAnyAccount={() => setAnyAccountMode(true)}
            createdAccountAddress={createdAccountAddress}
            flowAccountAddress={flowAccountAddress}
            flowAccountPrivateKey={flowAccountPrivateKey}
            avatarUrl={avatarUrl}
          />
        </div>
      )}
    </Dialog>
  )
}

function Authn() {
  const {flowAvatarUrl, flowAccountAddress, flowAccountPrivateKey} = useConfig()

  return (
    <AuthnContextProvider>
      <AuthnDialog
        flowAccountAddress={flowAccountAddress}
        flowAccountPrivateKey={flowAccountPrivateKey}
        avatarUrl={flowAvatarUrl}
      />
    </AuthnContextProvider>
  )
}

export default Authn
