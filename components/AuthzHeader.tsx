/** @jsxImportSource theme-ui */
import useAuthzContext from "hooks/useAuthzContext"
import {UNTITLED_APP_NAME} from "src/constants"
import {Label} from "theme-ui"
import {SXStyles} from "types"
import AccountImage from "./AccountImage"
import ConnectedAppIcon from "./ConnectedAppIcon"

const styles: SXStyles = {
  header: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pt: 4,
  },
  headerSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    px: [0, 3],
    zIndex: 1,
  },
  label: {
    position: "relative",
    width: "auto",
    display: "flex",
    alignItems: "center",
  },
  greenDot: {
    position: "absolute",
    mt: "-2px",
    left: -15,
    backgroundColor: "primary",
    width: 7,
    height: 7,
    borderRadius: 7,
  },
  transactionIcon: {
    position: "absolute",
    top: 45,
  },
}

function AuthzHeader({
  flowAccountAddress,
  avatarUrl,
}: {
  flowAccountAddress: string
  avatarUrl: string
}) {
  const {currentUser, connectedAppConfig} = useAuthzContext()
  const title = connectedAppConfig?.config?.app?.title || UNTITLED_APP_NAME
  const icon = connectedAppConfig?.config?.app?.icon
  return (
    <div sx={styles.header}>
      <div sx={styles.transactionIcon}>
        <img src="/transaction.svg" />
      </div>
      <div sx={styles.headerSection}>
        <AccountImage
          address={currentUser.address}
          seed={title}
          lg={true}
          flowAccountAddress={flowAccountAddress}
          avatarUrl={avatarUrl}
        />
        <Label sx={styles.label}>
          <div sx={styles.greenDot} />
          {currentUser.label}
        </Label>
      </div>
      <div sx={styles.headerSection}>
        <ConnectedAppIcon icon={icon} />
        <Label sx={styles.label}>{title}</Label>
      </div>
    </div>
  )
}

export default AuthzHeader
