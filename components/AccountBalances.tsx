/** @jsxImportSource theme-ui */
import * as fcl from "@onflow/fcl"
import useAccount from "hooks/useAccount"
import useFUSDBalance from "hooks/useFUSDBalance"
import {FLOW_TYPE, FUSD_TYPE, paths, TokenTypes} from "src/constants"
import {currency} from "src/currency"
import {mutate} from "swr"
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
  const {data: fusdBalance} = useFUSDBalance(address)
  const {data: account} = useAccount(address)

  const isServiceAccount =
    fcl.withPrefix(address) === fcl.withPrefix(flowAccountAddress)

  const fund = (token: TokenTypes) => {
    fetch(paths.apiAccountFund(address), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token}),
    })
      .then(d => d.json())
      .then(() => {
        mutate(paths.apiAccountFUSDBalance(address))
        mutate(paths.apiAccount(address))
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <>
      <AccountSectionHeading compact={true}>Funds</AccountSectionHeading>
      <Themed.hr sx={{backgroundColor: "gray.400", m: 0}} />
      <div sx={styles.accountSection}>
        <Label sx={styles.label}>FLOW</Label>
        <div sx={styles.balance}>{currency(account?.balance || 0, 20)}</div>
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
        <div sx={styles.balance}>{currency(fusdBalance)}</div>
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
