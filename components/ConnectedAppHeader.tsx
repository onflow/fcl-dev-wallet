/** @jsxImportSource theme-ui */
import AccountImage from "components/AccountImage"
import InfoIcon from "components/InfoIcon"
import useAppContext from "hooks/useAppContext"
import {Account} from "pages/api/accounts"
import {useState} from "react"
import {Button, Themed} from "theme-ui"
import {SXStyles} from "types"

const styles: SXStyles = {
  container: {
    textAlign: "center",
    position: "relative",
  },
  info: {
    textAlign: "left",
    fontSize: 1,
    color: "textMedium",
    marginTop: -2,
  },
  infoLabel: {
    opacity: 0.8,
  },
  imageContainer: {
    width: 65,
    height: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    margin: "0 auto",
  },
  title: {
    marginTop: 3,
    marginBottom: 2,
  },
  accountImage: {
    width: 65,
    borderRadius: 65,
    overflow: "hidden",
  },
  image: {
    borderRadius: 65,
    width: 65,
  },
  description: {
    maxWidth: 340,
    margin: "0 auto",
  },
  infoButton: {
    position: "absolute",
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}

export default function ConnectedAppHeader({
  title,
  description,
  info = true,
  account,
}: {
  title?: string
  description?: string
  info?: boolean
  account?: Account
}) {
  const [showInfo, setShowInfo] = useState(false)
  const {
    connectedAppConfig: {
      app: {icon, title: connectedAppTitle},
    },
  } = useAppContext()
  const toggleShowInfo = () => setShowInfo(prev => !prev)

  return (
    <div sx={styles.container}>
      {info && (
        <div id="info">
          {showInfo && (
            <div sx={styles.info}>
              <div>
                <span sx={styles.infoLabel}>app.detail.icon:</span> {icon}
              </div>
              <div>
                <span sx={styles.infoLabel}>app.detail.title:</span>{" "}
                {connectedAppTitle}
              </div>
              <Themed.hr />
            </div>
          )}
        </div>
      )}
      <div>
        {info && (
          <Button
            variant="unstyled"
            sx={styles.infoButton}
            onClick={toggleShowInfo}
            aria-controls="info"
            aria-expanded={showInfo}
          >
            <InfoIcon active={showInfo} />
          </Button>
        )}
        <div sx={styles.imageContainer}>
          {account ? (
            <AccountImage
              address={account.address}
              sxStyles={styles.accountImage}
            />
          ) : (
            <img src={icon} sx={styles.image} />
          )}
        </div>
        <Themed.h1 sx={styles.title}>{title || connectedAppTitle}</Themed.h1>
        {description && (
          <Themed.p sx={styles.description}>{description}</Themed.p>
        )}
      </div>
    </div>
  )
}
