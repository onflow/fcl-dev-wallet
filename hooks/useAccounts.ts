import {useState} from "react"
import {Account, getAccounts} from "src/accounts"

export default function useAccounts() {
  const [accounts, setAccounts] = useState<Array<Account>>([])
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  getAccounts()
    .then(accounts => {
      setAccounts(accounts)
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoading(false))

  return {
    data: accounts,
    error: error,
    isLoading: isLoading,
  }
}
