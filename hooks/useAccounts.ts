import {useCallback, useEffect, useState} from "react"
import {Account, getAccounts} from "src/accounts"
import useConfig from "hooks/useConfig"

export default function useAccounts() {
  const [accounts, setAccounts] = useState<Array<Account>>([])
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const {flowAccountAddress} = useConfig()

  const fetchAccounts = useCallback(() => {
    getAccounts({flowAccountAddress})
      .then(accounts => {
        setAccounts(accounts)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoading(false))
  }, [flowAccountAddress])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return {
    data: accounts,
    error: error,
    isLoading: isLoading,
    refresh: fetchAccounts,
  }
}
