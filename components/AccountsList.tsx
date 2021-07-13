/** @jsxImportSource theme-ui */
import AccountsListItem from "components/AccountsListItem"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import PlusButton from "components/PlusButton"
import useAppContext from "hooks/useAppContext"
import {Account} from "pages/api/accounts"
import React, {SetStateAction} from "react"
import {paths} from "src/constants"
import {mutate} from "swr"
import {Box, Link, Themed} from "theme-ui"

const styles = {
  footer: {
    lineHeight: 1.7,
    color: "gray.400",
    fontSize: 0,
  },
}

const createAccount = async () => {
  await fetch(paths.apiAccountsNew, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
  mutate(paths.apiAccounts)
}

const initAccounts = async () => {
  await fetch(paths.apiInit, {
    method: "POST",
  })
  mutate(paths.apiAccounts)
  mutate(paths.apiIsInit)
}

export default function AccountsList({
  accounts,
  onEditAccount,
}: {
  accounts: Account[]
  onEditAccount: React.Dispatch<SetStateAction<Account | null>>
}) {
  const {isInit} = useAppContext()

  return (
    <div>
      <Box mb={4}>
        <ConnectedAppHeader description="Create an account below, Lorem ipsum dolor sit amet, consectetur adipis elit. Curabitur." />
      </Box>
      <Box mb={2}>
        {accounts.map(account => (
          <AccountsListItem
            key={account.address}
            account={account}
            onEditAccount={onEditAccount}
          />
        ))}
      </Box>
      <Box mb={4}>
        {isInit ? (
          <PlusButton onClick={createAccount}>Create New Account</PlusButton>
        ) : (
          <PlusButton onClick={initAccounts}>
            Initialize Dev Wallet for more Accounts
          </PlusButton>
        )}
        <Themed.hr sx={{mt: 2, mb: 0}} />
      </Box>
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
