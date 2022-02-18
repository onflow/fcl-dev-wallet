/** @jsxImportSource theme-ui */
import AccountsListItem from "components/AccountsListItem"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import PlusButton from "components/PlusButton"
import useAuthnContext from "hooks/useAuthnContext"
import {Account, NewAccount} from "pages/api/accounts"
import accountGenerator from "src/accountGenerator"
import {Box, Themed} from "theme-ui"
import {SXStyles} from "types"
import FormErrors from "./FormErrors"

const styles: SXStyles = {
  accountCreated: {
    backgroundColor: "#00EF8B1A",
    border: "1px solid #00EF8B",
    textAlign: "center",
    py: 10,
    px: 3,
    mb: 3,
  },
  plusButtonContainer: {
    height: 90,
    display: "flex",
    alignItems: "center",
  },
  footer: {
    lineHeight: 1.7,
    color: "gray.400",
    fontSize: 0,
  },
}

export default function AccountsList({
  accounts,
  onEditAccount,
  createdAccountAddress,
  flowAccountAddress,
  flowAccountPrivateKey,
  avatarUrl,
}: {
  accounts: Account[]
  onEditAccount: (account: Account | NewAccount) => void
  createdAccountAddress: string | null
  flowAccountAddress: string
  flowAccountPrivateKey: string,
  avatarUrl: string
}) {
  const {initError} = useAuthnContext()

  return (
    <div>
      <Box mb={4}>
        <ConnectedAppHeader
          description="Select an existing account to log in or create a new account."
          flowAccountAddress={flowAccountAddress}
          avatarUrl={avatarUrl}
        />
      </Box>
      {createdAccountAddress && (
        <div sx={styles.accountCreated}>
          <b>Account Created</b>
        </div>
      )}
      {initError ? (
        <FormErrors errors={[initError]} />
      ) : (
        <>
          <Box>
            {accounts.map(account => (
              <AccountsListItem
                key={account.address}
                account={account}
                onEditAccount={onEditAccount}
                isNew={account.address === createdAccountAddress}
                flowAccountAddress={flowAccountAddress}
                flowAccountPrivateKey={flowAccountPrivateKey}
                avatarUrl={avatarUrl}
              />
            ))}
          </Box>
          <Box sx={styles.plusButtonContainer}>
            <PlusButton
              onClick={() =>
                onEditAccount(accountGenerator(accounts.length - 1))
              }
              data-test="create-account-button"
            >
              Create New Account
            </PlusButton>
          </Box>
          <Themed.hr sx={{mt: 0, mb: 4}} />
        </>
      )}
    </div>
  )
}
