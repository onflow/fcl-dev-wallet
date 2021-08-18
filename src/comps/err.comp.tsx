export type StackError = {
  stack: string
}

export function Err({error}: {error: StackError}) {
  if (error == null) return null
  return (
    <div>
      <pre>{error.stack}</pre>
    </div>
  )
}
