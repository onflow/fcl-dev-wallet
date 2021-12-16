import {paths} from "src/constants"
import useSWR from "swr"

export function compFUSDBalanceKey(address: string) {
  return `${address}/fusd-balance`
}

export function expandFUSDBalanceKey(key: string) {
  return {
    address: key.split("/")[0],
  }
}

export default function useFUSDBalance(address: string) {
  const {data, error} = useSWR(paths.apiAccountFUSDBalance(address))
  return {data: parseFloat(data), error, isLoading: !data && !error}
}
