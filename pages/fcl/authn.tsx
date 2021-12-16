/** @jsxImportSource theme-ui */
import AccountForm from "components/AccountForm"
import AccountsList from "components/AccountsList"
import Dialog, {styles as dialogStyles} from "components/Dialog"
import {AuthnContextProvider} from "contexts/AuthnContext"
import useAccounts from "hooks/useAccounts"
import getConfig from "next/config"
import {Account, NewAccount} from "pages/api/accounts"
import {useState} from "react"
import {Err} from "src/comps/err.comp"

function Authn({
  flowAccountAddress,
  avatarUrl,
}: {
  flowAccountAddress: string
  avatarUrl: string
}) {
  const [editingAccount, setEditingAccount] = useState<
    Account | NewAccount | null
  >(null)
  const {data, error, isLoading} = useAccounts()
  const [createdAccountAddress, setCreatedAccountAddress] = useState<
    string | null
  >(null)

  const onEditAccount = (account: Account | NewAccount) => {
    setCreatedAccountAddress(null)
    setEditingAccount(account)
  }

  const onSubmitComplete = (createdAccountAddress?: string) => {
    setEditingAccount(null)
    if (createdAccountAddress) setCreatedAccountAddress(createdAccountAddress)
  }
  const onCancel = () => setEditingAccount(null)

  if (!data && error) return <Err error={error} />
  if (!data || isLoading) return null

  return (
    <AuthnContextProvider>
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
              accounts={data}
              onEditAccount={onEditAccount}
              createdAccountAddress={createdAccountAddress}
              flowAccountAddress={flowAccountAddress}
              avatarUrl={avatarUrl}
            />
          </div>
        )}
      </Dialog>
    </AuthnContextProvider>
  )
}

Authn.getInitialProps = async () => {
  const {publicRuntimeConfig} = getConfig()

  return {
    flowAccountAddress: publicRuntimeConfig.flowAccountAddress,
    avatarUrl: publicRuntimeConfig.avatarUrl,
  }
}

export default Authn
