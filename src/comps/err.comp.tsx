/** @jsxImportSource theme-ui */
import Dialog from "../../components/Dialog"
import {Themed} from "theme-ui"

export type StackError = {
  stack: string
}

type Error = StackError | string

export function Err({error}: {error: Error}) {
  return (
    <Dialog>
      <Themed.h1 sx={{textAlign: "center", mb: 20}}>Error occurred</Themed.h1>
      <div>
        <pre>{getErrorMessage(error)}</pre>
      </div>
    </Dialog>
  )
}

function getErrorMessage(error: Error) {
  if (typeof error === "string") {
    return error
  } else {
    return error.stack
  }
}
