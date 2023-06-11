import {WalletUtils} from "@onflow/fcl"
import {useEffect, useState} from "react"

export function useFclData<T, U = any, V = any>({
  transformFrontchannel,
  transformBackchannel,
}: {
  transformFrontchannel?: (data: U) => T
  transformBackchannel?: (data: V) => T
} = {}) {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("channel") && urlParams.get("channel") === "back") {
      const fclMessageJson = urlParams.get("fclMessageJson")
      if (!fclMessageJson) {
        throw new Error("fclMessageJson is missing")
      }
      const data = JSON.parse(fclMessageJson)
      setData(transformBackchannel ? transformBackchannel(data) : data)
      return
    }

    function callback(data: U | T) {
      setData(
        transformFrontchannel ? transformFrontchannel(data as U) : (data as T)
      )
    }

    WalletUtils.ready(callback)
  }, [])

  return data
}
