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
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 3,
    fontFamily: "inherit",
    fontWeight: "normal",
  },
  iconSecondary: {
    backgroundColor: "green",
  },
}

export default function PlusButton({
  onClick,
  disabled,
  children,
  icon,
}: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
  children: React.ReactNode
  icon?: "plus" | "arrow"
}) {
  const isArrow = icon === "arrow"
  
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
      <div sx={{...styles.icon, ...(isArrow ? styles.iconSecondary : {})}}>
        {isArrow ? (
          <span
            sx={{
              fontSize: "30px",
              lineHeight: 1,
              fontWeight: "normal",
              color: "white",
            }}
          >
            ↪
          </span>
        ) : (
          <img src="/plus-icon.svg" />
        )}
      </div>
      {children}
    </Button>
  )
}
