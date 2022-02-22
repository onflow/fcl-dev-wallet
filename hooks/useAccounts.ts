import {useEffect, useState} from "react"
import {Account, getAccounts} from "src/accounts"

export default function useAccounts() {
  const [accounts, setAccounts] = useState<Array<Account>>([])
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  function fetchAccounts() {
    getAccounts()
      .then(accounts => {
        setAccounts(accounts)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return {
    data: accounts,
    error: error,
    isLoading: isLoading,
    refresh: fetchAccounts,
  }
}
