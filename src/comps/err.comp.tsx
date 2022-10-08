export type StackError = {
  stack: string
}

type Error = StackError|string

export function Err({error}: {error: Error}) {
  if (error == null) return null
  return (
    <div>
      <pre>{getErrorMessage(error)}</pre>
    </div>
  )
}

function getErrorMessage(error: Error) {
  if (typeof error === "string") {
    return error;
  } else {
    return error.stack;
  }
}

