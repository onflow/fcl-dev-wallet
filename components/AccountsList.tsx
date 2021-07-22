/** @jsxImportSource theme-ui */
import AccountsListItem from "components/AccountsListItem"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import FormErrors from "components/FormErrors"
import PlusButton from "components/PlusButton"
import useAppContext from "hooks/useAppContext"
import {Account, NewAccount} from "pages/api/accounts"
import {useState} from "react"
import {NEW_ACCOUNT, paths} from "src/constants"
import {mutate} from "swr"
import {Box, Link, Themed} from "theme-ui"
import {SXStyles} from "types"

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
  const {isInit} = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initAccounts = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await fetch(paths.apiInit, {
        method: "POST",
      })
      mutate(paths.apiAccounts)
      mutate(paths.apiIsInit)
      setIsLoading(false)
    } catch {
      setError("Dev Wallet initialization failed.")
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Box mb={4}>
        <ConnectedAppHeader description="Create an account below, Lorem ipsum dolor sit amet, consectetur adipis elit. Curabitur." />
      </Box>
      {createdAccountAddress && (
        <div sx={styles.accountCreated}>
          <b>Account Created —</b> Lorem ipsum dolor sit amet, consectetur
          adipis elit. Curabitur quis gravida.
        </div>
      )}
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
        {isInit ? (
          <PlusButton
            onClick={() => onEditAccount(NEW_ACCOUNT)}
            disabled={isLoading}
          >
            Create New Account
          </PlusButton>
        ) : (
          <PlusButton onClick={initAccounts} disabled={isLoading}>
            Initialize Dev Wallet for more Accounts
          </PlusButton>
        )}
        <Themed.hr sx={{mt: 2, mb: 0}} />
      </Box>
      {error && <FormErrors errors={[error]} />}
      <Box mb={4}>
        <div sx={styles.footer}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          quis gravida nunc, luctus sodales erat. Ut sit amet lectus tempor
          dipiscing. Curabitur quis gravida nunc, lelit scelerisque ornare ut
          non lectus.
          <br />
          <Link variant="secondary">privacy policy</Link> and{" "}
          <Link variant="secondary">terms of service</Link>.
        </div>
      </Box>
    </div>
  )
}
