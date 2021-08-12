/** @jsxImportSource theme-ui */
import AccountImage from "components/AccountImage"
import AccountListItemScopes from "components/AccountListItemScopes"
import Button from "components/Button"
import CaretIcon from "components/CaretIcon"
import useAuthnContext from "hooks/useAuthnContext"
import {Account, NewAccount} from "pages/api/accounts"
import {useEffect, useState} from "react"
import {chooseAccount} from "src/accountAuth"
import {Flex, Themed} from "theme-ui"
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
    ml: 2,
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
  manageAccountButton: {
    margin: 0,
    padding: 0,
    fontSize: 0,
    fontWeight: "normal",
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
  const {connectedAppConfig, appScopes} = useAuthnContext()
  const {
    app: {title},
  } = connectedAppConfig

  const [showScopes, setShowScopes] = useState(false)
  const [scopes, setScopes] = useState<Set<string>>(new Set(account.scopes))
  const toggleShowScopes = () => setShowScopes(prev => !prev)
  const hasScopes = appScopes.length > 0

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
            onClick={e => chooseAccount(account, scopes, connectedAppConfig)(e)}
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
          <Flex>
            <Button
              variant="link"
              onClick={() => onEditAccount(account)}
              sx={styles.manageAccountButton}
              data-test="manage-account-button"
            >
              Manage
            </Button>
            {hasScopes && (
              <Button
                variant="unstyled"
                sx={styles.toggleScopesButton}
                onClick={toggleShowScopes}
                aria-controls="scopes"
                aria-expanded={showScopes}
                data-test="expand-account-button"
              >
                <CaretIcon up={showScopes} active={showScopes} />
              </Button>
            )}
          </Flex>
        </div>
        {hasScopes && showScopes && (
          <AccountListItemScopes scopes={scopes} setScopes={setScopes} />
        )}
      </div>
      <Themed.hr sx={{mt: 0, mb: 0}} />
    </>
  )
}
