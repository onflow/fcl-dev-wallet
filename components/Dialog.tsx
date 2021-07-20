/** @jsxImportSource theme-ui */
import {Dialog as HUIDialog} from "@headlessui/react"
import {Button} from "theme-ui"

const styles = {
  dialog: {
    width: ["100%", 500],
    minHeight: 400,
    margin: "0 auto",
    backgroundColor: "white",
    boxShadow: "0px 4px 74px 0px #00000026",
    borderRadius: 8,
  },
  "@media screen and (max-width: 500px)": {
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    pl: 3,
    pr: 1,
    mb: 40,
    borderBottom: "1px solid",
    borderColor: "gray.200",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    ml: 1,
    fontSize: 1,
    color: "gray.500",
    marginTop: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "closeButton:hover": {
    opacity: 0.5,
  },
  body: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
  },
}

export default function Dialog({
  onClose,
  children,
}: {
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    // @ts-expect-error The headless-ui dialog raises a "Expression produces a union type that is too complex to represent" error when used with theme-ui sx props
    // See https://github.com/tailwindlabs/headlessui/issues/233, https://github.com/tailwindlabs/headlessui/issues/330
    <HUIDialog
      open={true}
      onClose={onClose}
      sx={styles.dialog}
      initialFocus={undefined}
    >
      <HUIDialog.Overlay />
      <div sx={styles.header}>
        <div sx={styles.logo}>
          <img src="/flow-logo.svg" />
          <span sx={styles.logoText}>FCL Dev Wallet</span>
        </div>
        <Button variant="unstyled" onClick={onClose} style={styles.closeButton}>
          <img src="/x-icon.svg" />
        </Button>
      </div>
      <div sx={styles.body}>{children}</div>
    </HUIDialog>
  )
}
