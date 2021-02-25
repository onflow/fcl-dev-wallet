import css from "../../styles/base.module.css"
import {Err} from "./err.comp.js"

export function Header({children, onClose, subHeader, error}) {
  return (
    <>
      {typeof onClose === "function" && (
        <div className={css.close}>
          <button onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      <h1>
        FCL Dev Wallet{" "}
        <sup title="alpha">
          <small>alpha</small>
        </sup>
      </h1>
      <Err error={error} />
      {children}
      {subHeader && (
        <div>
          <h3>{subHeader}</h3>
        </div>
      )}
    </>
  )
}
