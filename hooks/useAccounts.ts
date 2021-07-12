import {Account} from "pages/api/accounts"
import {paths} from "src/constants"
import useSWR from "swr"

export default function useAccounts() {
  const {data, error} = useSWR<Account[]>(paths.apiAccounts)

  return {
    data,
    error: error,
    isLoading: !error && !data,
  }
}
