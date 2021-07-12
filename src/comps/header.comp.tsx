import {Err, StackError} from "src/comps/err.comp"

type Props = {
  subHeader: React.ReactNode
  error?: StackError
  children?: React.ReactNode
}

export function Header({subHeader, error, children}: Props) {
  return (
    <>
      <h1>
        FCL Dev Wallet{" "}
        <sup title="alpha">
          <small>alpha</small>
        </sup>
      </h1>
      {!!error && <Err error={error} />}
      {children}
      {subHeader && (
        <div>
          <h3>{subHeader}</h3>
        </div>
      )}
    </>
  )
}
