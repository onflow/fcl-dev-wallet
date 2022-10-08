/** @jsxImportSource theme-ui */
import AccountForm from "components/AccountForm"
import AccountsList from "components/AccountsList"
import Dialog, {styles as dialogStyles} from "components/Dialog"
import {AuthnContextProvider} from "contexts/AuthnContext"
import useAccounts from "hooks/useAccounts"
import {Account, NewAccount} from "src/accounts"
import {useState} from "react"
import {Err} from "src/comps/err.comp"
import useConfig from "hooks/useConfig"
import { Loading } from "../../components/Loading";

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

  if (error) return <Err error={error} />
  if (isLoading) return <Loading />

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
      ) : (
        <div sx={dialogStyles.body}>
          <AccountsList
            accounts={accounts}
            onEditAccount={onEditAccount}
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
  const {avatarUrl, flowAccountAddress, flowAccountPrivateKey} = useConfig()

  return (
    <AuthnContextProvider>
      <AuthnDialog
        flowAccountAddress={flowAccountAddress}
        flowAccountPrivateKey={flowAccountPrivateKey}
        avatarUrl={avatarUrl}
      />
    </AuthnContextProvider>
  )
}

export default Authn
