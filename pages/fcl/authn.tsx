import AccountEdit from "components/AccountEdit"
import AccountsList from "components/AccountsList"
import useAccounts from "hooks/useAccounts"
import {Account} from "pages/api/accounts"
import {useState} from "react"
import {Err} from "src/comps/err.comp"

export default function Authn() {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const {data, error, isLoading} = useAccounts()

  const clearEditingAccount = () => setEditingAccount(null)

  if (!data && error) return <Err error={error} />
  if (!data || isLoading) return "Loading accounts..."

  if (editingAccount) {
    return <AccountEdit account={editingAccount} onBack={clearEditingAccount} />
  }

  return <AccountsList accounts={data} onEditAccount={setEditingAccount} />
}
