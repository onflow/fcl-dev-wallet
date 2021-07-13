import {Dialog as HUIDialog} from "@headlessui/react"
import useThemeUI from "hooks/useThemeUI"
import {Button} from "theme-ui"

export default function Dialog({
  onClose,
  children,
}: {
  onClose: () => void
  children: React.ReactNode
}) {
  const {theme} = useThemeUI()

  const styles = {
    dialog: {
      width: 500,
      minHeight: 400,
      margin: "0 auto",
      backgroundColor: theme.colors.white,
      boxShadow: "0px 4px 74px 0px #00000026",
      borderRadius: 8,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 52,
      paddingLeft: theme.space[3],
      paddingRight: theme.space[1],
      marginBottom: 40,
      borderBottom: "1px solid",
      borderColor: theme.colors.gray[200],
    },
    logo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      marginLeft: theme.space[1],
      fontSize: theme.fontSizes[1],
      color: theme.colors.gray[500],
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
      paddingLeft: 50,
      paddingRight: 50,
      paddingBottom: theme.space[2],
    },
  }

  return (
    <HUIDialog
      open={true}
      onClose={onClose}
      style={styles.dialog}
      initialFocus={undefined}
    >
      <HUIDialog.Overlay />
      <div style={styles.header}>
        <div style={styles.logo}>
          <img src="/flow-logo.svg" />
          <span style={styles.logoText}>FCL Dev Wallet</span>
        </div>
        <Button variant="unstyled" onClick={onClose} style={styles.closeButton}>
          <img src="/x-icon.svg" />
        </Button>
      </div>
      <div style={styles.body}>{children}</div>
    </HUIDialog>
  )
}
