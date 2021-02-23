import css from "../../styles/base.module.css"

export function Err({error}) {
  if (error == null) return null
  return (
    <div className={css.bad}>
      <pre>{error.stack}</pre>
    </div>
  )
}
