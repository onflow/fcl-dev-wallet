import {useEffect, useState} from "react"
import {getAccountFUSDBalance} from "src/accounts"

export function compFUSDBalanceKey(address: string) {
  return `${address}/fusd-balance`
}

export function expandFUSDBalanceKey(key: string) {
  return {
    address: key.split("/")[0],
  }
}

export default function useFUSDBalance(address: string) {
  const [balance, setBalance] = useState<number | null>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  function fetchFUSDBalance() {
    getAccountFUSDBalance(address)
      .then(balance => {
        setBalance(balance)
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchFUSDBalance()
  }, [])

  return {
    data: balance,
    error: error,
    isLoading: isLoading,
    refresh: fetchFUSDBalance,
  }
}
