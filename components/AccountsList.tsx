/** @jsxImportSource theme-ui */
import AccountsListItem from "components/AccountsListItem"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import PlusButton from "components/PlusButton"
import useAuthnContext from "hooks/useAuthnContext"
import {Account, NewAccount} from "pages/api/accounts"
import accountGenerator from "src/accountGenerator"
import {Box, Link, Themed} from "theme-ui"
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
}: {
  accounts: Account[]
  onEditAccount: (account: Account | NewAccount) => void
  createdAccountAddress: string | null
}) {
  const {initError} = useAuthnContext()

  return (
    <div>
      <Box mb={4}>
        <ConnectedAppHeader description="Create an account below, or select an existing account, to log in as that account." />
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
          <Box mb={2}>
            {accounts.map(account => (
              <AccountsListItem
                key={account.address}
                account={account}
                onEditAccount={onEditAccount}
                isNew={account.address === createdAccountAddress}
              />
            ))}
          </Box>
          <Box mb={4}>
            <PlusButton
              onClick={() =>
                onEditAccount(accountGenerator(accounts.length - 1))
              }
              data-test="create-account-button"
            >
              Create New Account
            </PlusButton>
            <Themed.hr sx={{mt: 2, mb: 0}} />
          </Box>
        </>
      )}
      <Box mb={4}>
        <div sx={styles.footer}>
          fcl-dev-wallet is for development purposes only. Although it applies
          the same protocol as production wallets, it is not intended for
          production use.
          <br />
          <Link variant="secondary">privacy policy</Link> and{" "}
          <Link variant="secondary">terms of service</Link>.
        </div>
      </Box>
    </div>
  )
}
