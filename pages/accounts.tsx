import swr from "swr"
import {AccountsResponse} from "./api/accounts"
import {ConfigResponse} from "./api/config"

function Config() {
  const {data: config, error} = swr<ConfigResponse>(`/api/config`)

  if (!config) return <div>Loading...</div>
  if (error) return <div>Couldn&apos;t fetch Config Data</div>

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
}

function Accounts() {
  const {data: accounts, error} = swr<AccountsResponse>(`/api/accounts`)

  if (!accounts) return <div>Loading...</div>
  if (error) return <div>Couldn&apos;t fetch Accounts Data</div>

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
