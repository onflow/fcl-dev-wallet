import {useEffect, useState} from "react"
import {Account, getAccount} from "src/accounts"

export default function useAccount(address: string) {
  const [account, setAccount] = useState<Account | null>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  function fetchAccount() {
    getAccount(address)
      .then(account => {
        setAccount(account)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchAccount()
  }, [])
  
  return {
    data: account,
    error: error,
    isLoading: isLoading,
    refresh: fetchAccount
  }
}
