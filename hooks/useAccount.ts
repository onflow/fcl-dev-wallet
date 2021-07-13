import {Account} from "pages/api/accounts"
import {paths} from "src/constants"
import useSWR from "swr"

export default function useAccount(address?: string | string[]) {
  const {data, error} = useSWR<Account>(
    !!address
      ? paths.apiAccount(Array.isArray(address) ? address[0] : address)
      : null
  )

  return {
    data,
    error: error,
    isLoading: !error && !data,
  }
}
