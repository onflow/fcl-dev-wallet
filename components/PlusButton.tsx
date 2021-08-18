/** @jsxImportSource theme-ui */
import Button from "components/Button"
import React from "react"
import {SXStyles} from "types"

const styles: SXStyles = {
  button: {
    textTransform: "none",
    paddingLeft: 0,
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    fontWeight: 600,
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
  disabled,
  children,
}: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      variant="unstyled"
      size="sm"
      onClick={onClick}
      sx={styles.button}
      block
      disabled={disabled}
      data-test="plus-button"
    >
      <div sx={styles.icon}>
        <img src="/plus-icon.svg" />
      </div>
      {children}
    </Button>
  )
}
