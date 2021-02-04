import {useState, useEffect} from "react"
import swr from "swr"

function Config() {
  const {data: config, error} = swr(`/api/config`)

  if (!config) return <div>Loading...</div>
  if (error) return <div>Couldn't fetch Config Data</div>

  return (
    <div>
      <h1>Config</h1>
      <ul>
        {Object.entries(config).map(([key, value]) => {
          return (
            <li key={key}>
              <strong>{key}: </strong>
              <span>{value}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return <pre>{JSON.stringify(config, null, 2)}</pre>
}

function Accounts() {
  const {data: accounts, error} = swr(`/api/accounts`)

  if (!accounts) return <div>Loading...</div>
  if (error) return <div>Couldn't fetch Accounts Data</div>

  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        {accounts.map(a => {
          return (
            <li key={a.address}>
              <pre>{JSON.stringify(a, null, 2)}</pre>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <Config />
      <Accounts />
    </div>
  )
}
