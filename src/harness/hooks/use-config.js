import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export default function useConfig() {
  const [config, setConfig] = useState(null)
  useEffect(() => fcl.config().subscribe(setConfig), [])
  return config
}
