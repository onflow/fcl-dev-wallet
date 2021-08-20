import React, { useEffect } from "react";
import "../src/config"
import decorate from "../src/decorate"
import {COMMANDS} from "../src/cmds"
import useCurrentUser from "../src/hooks/use-current-user"
import useConfig from "../src/hooks/use-config"

const renderCommand = (d) => {
  return (
    <li key={d.LABEL}>
      <button onClick={d.CMD}>{d.LABEL}</button>
    </li>
  )
}

export default function Page() {
  useEffect(() => {
    decorate()
  })

  const currentUser = useCurrentUser()
  const config = useConfig()

  return (
    <div>
      <ul>{COMMANDS.map(renderCommand)}</ul>
      <pre>{JSON.stringify({currentUser, config}, null, 2)}</pre>
    </div>
  )
}
