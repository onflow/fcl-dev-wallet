/** @jsxImportSource theme-ui */
import Dialog from "../../components/Dialog"
import {Themed} from "theme-ui"

export type StackError = {
  stack: string;
}

export type ErrProps = {
  title?: string;
  error: StackError | string;
}

export function Err({error, title = "Error occurred"}: ErrProps) {
  return (
    <Dialog>
      <Themed.h1 sx={{textAlign: "center", mb: 20}}>{title}</Themed.h1>
      <div>
        <pre>{getErrorMessage(error)}</pre>
      </div>
    </Dialog>
  )
}

function getErrorMessage(error: StackError|string) {
  if (typeof error === "string") {
    return error
  } else {
    return error.stack
  }
}
