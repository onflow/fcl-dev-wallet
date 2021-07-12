/** @jsxImportSource theme-ui */
import Button from "components/Button"
import React from "react"
import {SXStyles} from "types"

const styles: SXStyles = {
  button: {
    textTransform: "none",
    fontWeight: "normal",
    paddingLeft: 0,
    justifyContent: "flex-start",
  },
  icon: {
    backgroundColor: "green",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 3,
    fontFamily: "inherit",
    fontWeight: "normal",
  },
}

export default function AccountsList({
  onClick,
  children,
}: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void

  children: React.ReactNode
}) {
  return (
    <Button variant="unstyled" onClick={onClick} sx={styles.button} block>
      <div sx={styles.icon}>
        <img src="/plus-icon.svg" />
      </div>
      {children}
    </Button>
  )
}
