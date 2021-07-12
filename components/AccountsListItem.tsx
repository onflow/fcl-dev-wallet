/** @jsxImportSource theme-ui */
import AccountListItemScopes from "components/AccountListItemScopes"
import Avatar from "components/Avatar"
import Button from "components/Button"
import CaretIcon from "components/CaretIcon"
import useAppContext from "hooks/useAppContext"
import {Account} from "pages/api/accounts"
import React, {SetStateAction, useState} from "react"
import {chooseAccount, ScopesObj} from "src/accountAuth"
import {Themed} from "theme-ui"
import {SXStyles} from "types"

const styles: SXStyles = {
  accountListItem: {
    marginX: -3,
    paddingX: 3,
    paddingBottom: 3,
  },
  accountButtonContainer: {
    display: "flex",
    items: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 40,
    borderRadius: 40,
    overflow: "hidden",
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
    justifyContent: "space-between",
  },
  toggleScopesButton: {
    height: 40,
    marginRight: -3,
  },
}

export default function AccountsListItem({
  account,
  onEditAccount,
}: {
  account: Account
  onEditAccount: React.Dispatch<SetStateAction<Account | null>>
}) {
  const {scopes} = useAppContext()
  const [showScopes, setShowScopes] = useState(false)
  const [scopesObj, setScopesObj] = useState<ScopesObj>(
    scopes
      ?.filter(Boolean)
      ?.reduce((acc, scope) => ({...acc, [scope]: false}), {})
  )
  const toggleShowScopes = () => setShowScopes(prev => !prev)

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
            onClick={e => chooseAccount(account, scopesObj)(e)}
          >
            <Avatar address={account.address} styles={styles.avatar} />
            <div sx={styles.chooseAccountButtonText}>
              {account.label}
              <div sx={styles.chooseAccountAddress}>{account.address}</div>
            </div>
          </Button>
          <Button
            variant="unstyled"
            sx={styles.toggleScopesButton}
            onClick={toggleShowScopes}
            aria-controls="scopes"
            aria-expanded={showScopes}
          >
            <CaretIcon up={showScopes} active={showScopes} />
          </Button>
        </div>
        {showScopes && (
          <AccountListItemScopes
            scopesObj={scopesObj}
            setScopesObj={setScopesObj}
            onEditAccount={() => onEditAccount(account)}
          />
        )}
      </div>
      <Themed.hr sx={{mt: 0, mb: 0}} />
    </>
  )
}
