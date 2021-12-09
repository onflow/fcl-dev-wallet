/** @jsxImportSource theme-ui */
import AccountImage from "components/AccountImage"
import Button from "components/Button"
import useAccount from "hooks/useAccount"
import useAuthnContext from "hooks/useAuthnContext"
import {Account, NewAccount} from "pages/api/accounts"
import {useEffect, useState} from "react"
import {chooseAccount} from "src/accountAuth"
import {currency} from "src/currency"
import {Flex, Themed} from "theme-ui"
import {SXStyles} from "types"

const styles: SXStyles = {
  accountListItem: {
    marginX: -15,
    paddingX: 15,
    height: 90,
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  accountButtonContainer: {
    display: "flex",
    items: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  accountImage: {
    marginRight: 20,
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
    fontSize: 0,
    color: "gray.600",
  },
  chooseAccountFlow: {
    fontSize: 0,
    color: "gray.600",
    display: "flex",
    alignItems: "center",
  },
  chooseAccountFlowLabel: {
    fontWeight: "normal",
    ml: 2,
  },
  chooseAccountButtonText: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    fontSize: 1,
    fontWeight: "normal",
  },
}

export default function AccountsListItem({
  account,
  onEditAccount,
  isNew,
  flowAccountAddress,
  avatarUrl,
}: {
  account: Account
  onEditAccount: (account: Account | NewAccount) => void
  isNew: boolean
  flowAccountAddress: string
  avatarUrl: string
}) {
  const {connectedAppConfig} = useAuthnContext()
  const {
    config: {
      app: {title},
    },
  } = connectedAppConfig

  const [scopes, setScopes] = useState<Set<string>>(new Set(account.scopes))
  const {data: accountData} = useAccount(account.address)

  useEffect(() => {
    setScopes(new Set(account.scopes))
  }, [account.scopes])

  const handleSelect = () => {
    chooseAccount(account, scopes, connectedAppConfig).catch(e =>
      console.error(e)
    )
  }

  return (
    <>
      <div sx={styles.accountListItem}>
        <div sx={styles.accountButtonContainer}>
          <Button
            variant="unstyled"
            sx={styles.chooseAccountButton}
            onClick={handleSelect}
            data-test="log-in-button"
          >
            <AccountImage
              address={account.address}
              seed={title}
              sxStyles={styles.accountImage}
              flowAccountAddress={flowAccountAddress}
              avatarUrl={avatarUrl}
            />
            <div sx={styles.chooseAccountButtonText}>
              <div>
                {account.label || account.address}
                {isNew && <span sx={styles.isNew}>New</span>}
              </div>
              <code sx={styles.chooseAccountAddress}>{account.address}</code>
              <code sx={styles.chooseAccountFlow}>
                {currency(accountData?.balance || 0)}
                <div sx={styles.chooseAccountFlowLabel}>FLOW</div>
              </code>
            </div>
          </Button>
          <Flex ml="auto">
            <Button
              variant="link"
              onClick={() => onEditAccount(account)}
              sx={styles.manageAccountButton}
              data-test="manage-account-button"
            >
              Manage
            </Button>
          </Flex>
        </div>
      </div>
      <Themed.hr sx={{m: 0}} />
    </>
  )
}
