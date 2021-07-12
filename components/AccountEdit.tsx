/** @jsxImportSource theme-ui */
import AccountListItemScopes from "components/AccountListItemScopes"
import Button from "components/Button"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import {Account} from "pages/api/accounts"
import {Box, Link} from "theme-ui"

const styles = {
  footer: {
    lineHeight: 1.7,
    color: "gray.400",
    fontSize: 0,
  },
}

export default function AccountEdit({
  account,
  onBack,
}: {
  account: Account
  onBack?: () => void
}) {
  // stubbed
  const onSubmit = () => {
    if (onBack) onBack()
  }

  return (
    <div>
      <Box mb={4}>
        <ConnectedAppHeader
          info={false}
          avatar={account}
          title="Manage Account"
          description={account.address}
        />
      </Box>

      <pre>{JSON.stringify(account, null, 2)}</pre>

      <Box mb={4}>
        <AccountListItemScopes
          scopesObj={{email: true}}
          setScopesObj={() => null}
          onEditAccount={() => null}
          showManageAccount={false}
        />
      </Box>

      <Box mb={4}>
        <Button onClick={onSubmit} block size="lg">
          Save
        </Button>
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
