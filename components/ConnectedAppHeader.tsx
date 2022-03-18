/** @jsxImportSource theme-ui */
import AccountImage from "components/AccountImage"
import InfoIcon from "components/InfoIcon"
import useAuthnContext from "hooks/useAuthnContext"
import {Account, NewAccount} from "src/accounts"
import {useState} from "react"
import {UNTITLED_APP_NAME} from "src/constants"
import {Button, Link, Themed} from "theme-ui"
import {SXStyles} from "types"
import ConnectedAppIcon from "./ConnectedAppIcon"

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
  image: {
    borderRadius: 65,
    width: 65,
  },
  description: {
    maxWidth: 340,
    margin: "0 auto",
  },
  externalAddressLink: {ml: 1, color: "blue", fontSize: 1},
  externalLinkImage: {
    ml: 2,
    position: "relative",
    top: "1px",
  },
  infoButton: {
    position: "absolute",
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  missingAppDetail: {
    color: "red.200",
    display: "inline-flex",
    alignItems: "center",
  },
}

function MissingAppDetail({text}: {text: string}) {
  return (
    <div sx={styles.missingAppDetail}>
      {text}
      <Link
        href="https://docs.onflow.org/fcl/api/#common-configuration-keys"
        target="_blank"
        sx={{ml: 1, color: "blue"}}
      >
        Learn More
      </Link>
    </div>
  )
}

export default function ConnectedAppHeader({
  title,
  description,
  info = true,
  account,
  flowAccountAddress,
  avatarUrl,
}: {
  title?: string
  description?: string
  info?: boolean
  account?: Account | NewAccount
  flowAccountAddress: string
  avatarUrl: string
}) {
  const [showInfo, setShowInfo] = useState(false)
  const {
    connectedAppConfig: {
      config: {
        app: {icon, title: connectedAppTitle},
      },
    },
  } = useAuthnContext()
  const toggleShowInfo = () => setShowInfo(prev => !prev)

  return (
    <div sx={styles.container}>
      {info && (
        <div id="info">
          {showInfo && (
            <div sx={styles.info}>
              <div>
                <span sx={styles.infoLabel}>app.detail.icon:</span>{" "}
                {icon || (
                  <MissingAppDetail text="Missing, please include an icon." />
                )}
              </div>
              <div>
                <span sx={styles.infoLabel}>app.detail.title:</span>{" "}
                {connectedAppTitle || (
                  <MissingAppDetail text="Untitled, please include a title." />
                )}
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
          {account?.address ? (
            <AccountImage
              address={account.address}
              seed={connectedAppTitle}
              lg={true}
              flowAccountAddress={flowAccountAddress}
              avatarUrl={avatarUrl}
            />
          ) : (
            <ConnectedAppIcon icon={icon} />
          )}
        </div>
        <Themed.h1 sx={styles.title}>
          {title || connectedAppTitle || UNTITLED_APP_NAME}
        </Themed.h1>
        {!!description && (
          <Themed.p sx={styles.description}>{description}</Themed.p>
        )}
      </div>
    </div>
  )
}
