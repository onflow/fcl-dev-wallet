/** @jsxImportSource theme-ui */
import * as fcl from "@onflow/fcl"
import useAccount from "hooks/useAccount"
import useFUSDBalance from "hooks/useFUSDBalance"
import {fundAccount} from "src/accounts"
import {formattedBalance} from "src/balance"
import {FLOW_TYPE, FUSD_TYPE, TokenTypes} from "src/constants"
import {Label, Themed} from "theme-ui"
import {SXStyles} from "types"
import AccountSectionHeading from "./AccountSectionHeading"
import Button from "./Button"

const styles: SXStyles = {
  label: {textTransform: "capitalize", margin: 0, marginRight: "auto"},
  accountSection: {
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid",
    borderColor: "gray.200",
  },
  balance: {
    fontSize: 1,
  },
  fundButton: {
    fontWeight: "bold",
    fontSize: 0,
    color: "black",
    ml: 4,
    px: 30,
    py: "7px",
    borderColor: "gray.200",
  },
}

export default function AccountBalances({
  address,
  flowAccountAddress,
}: {
  address: string
  flowAccountAddress: string
}) {
  const {data: fusdBalance, refresh: refreshFUSD} = useFUSDBalance(address)
  const {data: account, refresh: refreshAccount} = useAccount(address)

  const isServiceAccount =
    fcl.withPrefix(address) === fcl.withPrefix(flowAccountAddress)

  const fund = async (token: TokenTypes) => {
    await fundAccount(address, token)
    refreshAccount()
    refreshFUSD()
  }

  return (
    <>
      <AccountSectionHeading compact={true}>Funds</AccountSectionHeading>
      <Themed.hr sx={{backgroundColor: "gray.400", m: 0}} />
      <div sx={styles.accountSection}>
        <Label sx={styles.label}>FLOW</Label>
        <div sx={styles.balance}>
          {!!account?.balance ? formattedBalance(account.balance) : "0"}
        </div>
        {!isServiceAccount && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => fund(FLOW_TYPE)}
            sx={styles.fundButton}
            type="button"
          >
            Fund
          </Button>
        )}
      </div>
      <div sx={styles.accountSection}>
        <Label sx={styles.label}>FUSD</Label>
        <div sx={styles.balance}>
          {fusdBalance && formattedBalance(fusdBalance.toString())}
        </div>
        {!isServiceAccount && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => fund(FUSD_TYPE)}
            sx={styles.fundButton}
            type="button"
          >
            Fund
          </Button>
        )}
      </div>
    </>
  )
}
