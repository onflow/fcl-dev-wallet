/** @jsxImportSource theme-ui */
import {WalletUtils} from "@onflow/fcl"
import {Dialog as HUIDialog} from "@headlessui/react"
import useAuthzContext from "hooks/useAuthzContext"
import {useRef} from "react"
import {Box, Button} from "theme-ui"
import {SXStyles} from "types"
import ExpandCollapseButton from "./ExpandCollapseButton"

const styles: SXStyles = {
  dialog: {
    width: ["100%", 500],
    height: "90vh",
    margin: "0 auto",
    backgroundColor: "white",
    boxShadow: "0px 4px 74px 0px #00000026",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
  },
  dialogExpanded: {
    width: ["100%", "100%", "100%", 950],
    minHeight: "auto",
  },
  header: {
    position: "sticky",
    zIndex: 1,
    top: 0,
  },
  topHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    pl: 3,
    pr: 1,
    borderBottom: "1px solid",
    borderColor: "gray.200",
  },
  footer: {
    position: "sticky",
    zIndex: 1,
    bottom: 0,
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
    pt: 40,
    px: [15, 30],
    pb: 10,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflowY: "auto",
  },
}

export default function Dialog({
  title,
  header,
  footer,
  children,
}: {
  title?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const onClose = () => WalletUtils.close()
  const {isExpanded, setCodePreview} = useAuthzContext()

  return (
    // @ts-expect-error The headless-ui dialog raises a "Expression produces a union type that is too complex to represent" error when used with theme-ui sx props
    // See https://github.com/tailwindlabs/headlessui/issues/233, https://github.com/tailwindlabs/headlessui/issues/330
    <HUIDialog
      open={true}
      onClose={onClose}
      sx={{...styles.dialog, ...(isExpanded ? styles.dialogExpanded : {})}}
      initialFocus={closeButtonRef}
      data-test="dev-wallet"
    >
      <HUIDialog.Overlay />
      <div sx={{...styles.header, mb: isExpanded ? 0 : styles.header.mb}}>
        <div sx={styles.topHeader}>
          <div sx={styles.logo}>
            <img src="/flow-logo.svg" />
            <span sx={styles.logoText}>
              {["FCL Dev Wallet", title].filter(Boolean).join(" - ")}
            </span>
          </div>
          {isExpanded ? (
            <Box mr={2}>
              <ExpandCollapseButton onClick={() => setCodePreview(null)} />
            </Box>
          ) : (
            <Button
              variant="unstyled"
              onClick={onClose}
              sx={styles.closeButton}
              ref={closeButtonRef}
            >
              <img src="/x-icon.svg" />
            </Button>
          )}
        </div>
        {header}
      </div>
      <div
        sx={{
          ...styles.body,
          pt: isExpanded ? 0 : styles.body.pt,
          pb: isExpanded ? 0 : styles.body.pb,
        }}
      >
        {children}
      </div>
      <div sx={styles.footer}>{footer}</div>
    </HUIDialog>
  )
}
