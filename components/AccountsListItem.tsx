/** @jsxImportSource theme-ui */
import AccountImage from "components/AccountImage"
import AccountListItemScopes from "components/AccountListItemScopes"
import Button from "components/Button"
import CaretIcon from "components/CaretIcon"
import useAuthnContext from "hooks/useAuthnContext"
import {Account, NewAccount} from "pages/api/accounts"
import {useEffect, useState} from "react"
import {chooseAccount} from "src/accountAuth"
import {Themed} from "theme-ui"
import {SXStyles} from "types"

const styles: SXStyles = {
  accountListItem: {
    marginX: -3,
    paddingX: 3,
  },
  accountButtonContainer: {
    display: "flex",
    items: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accountImage: {
    marginRight: 2,
  },
  chooseAccountButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 66,
    paddingX: 0,
    color: "colors.black",
    background: "transparent",
    border: 0,
    textAlign: "left",
    fontSize: 2,
    marginRight: 10,
    textTransform: "initial",
    fontWeight: 600,
    lineHeight: "1.3rem",
  },
  chooseAccountAddress: {
    fontSize: 1,
    fontWeight: "normal",
    color: "gray.500",
  },
  chooseAccountButtonText: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  toggleScopesButton: {
    height: 40,
    marginRight: -3,
  },
  isNew: {
    textTransform: "uppercase",
    backgroundColor: "green",
    fontSize: 11,
    fontWeight: "bold",
    borderRadius: 14,
    position: "relative",
    top: "-2px",
    py: "1px",
    px: "7px",
    ml: 2,
  },
}

export default function AccountsListItem({
  account,
  onEditAccount,
  isNew,
}: {
  account: Account
  onEditAccount: (account: Account | NewAccount) => void
  isNew: boolean
}) {
  const {
    connectedAppConfig: {
      app: {title},
    },
  } = useAuthnContext()

  const [showScopes, setShowScopes] = useState(false)
  const [scopes, setScopes] = useState<Set<string>>(new Set(account.scopes))
  const toggleShowScopes = () => setShowScopes(prev => !prev)

  useEffect(() => {
    setScopes(new Set(account.scopes))
  }, [account.scopes])

  return (
    <>
      <div
        sx={{
          ...styles.accountListItem,
          backgroundColor: showScopes ? "gray.100" : "transparent",
        }}
      >
        <div sx={styles.accountButtonContainer}>
          <Button
            variant="unstyled"
            sx={styles.chooseAccountButton}
            onClick={e => chooseAccount(account, scopes)(e)}
            data-test="log-in-button"
          >
            <AccountImage
              address={account.address}
              seed={title}
              sxStyles={styles.accountImage}
            />
            <div sx={styles.chooseAccountButtonText}>
              <div>
                {account.label || account.address}
                {isNew && <span sx={styles.isNew}>New</span>}
              </div>
              <code sx={styles.chooseAccountAddress}>{account.address}</code>
            </div>
          </Button>
          <Button
            variant="unstyled"
            sx={styles.toggleScopesButton}
            onClick={toggleShowScopes}
            aria-controls="scopes"
            aria-expanded={showScopes}
            data-test="edit-account-button"
          >
            <CaretIcon up={showScopes} active={showScopes} />
          </Button>
        </div>
        {showScopes && (
          <AccountListItemScopes
            scopes={scopes}
            setScopes={setScopes}
            onEditAccount={() => onEditAccount(account)}
          />
        )}
      </div>
      <Themed.hr sx={{mt: 0, mb: 0}} />
    </>
  )
}
