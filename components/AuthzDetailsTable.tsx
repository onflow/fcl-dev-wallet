/** @jsxImportSource theme-ui */
import {alpha} from "@theme-ui/color"
import useAuthzContext from "hooks/useAuthzContext"
import {Account} from "pages/api/accounts"
import {SXStyles} from "types"

const styles: SXStyles = {
  table: {
    fontSize: [0, 1],
    width: "100%",
    borderCollapse: "collapse",
  },
  row: {
    "> td": {
      borderBottom: "1px solid",
      borderColor: alpha("gray.200", 0.7),
      verticalAlign: "top",
      py: 1,
      "&:first-of-type": {
        color: "gray.500",
      },
      "&:last-of-type": {
        textAlign: "right",
        fontFamily: "monospace",
        letterSpacing: "0.16em",
      },
    },
    "&:last-of-type": {
      "> td": {
        border: 0,
      },
    },
  },
  accountDetail: {
    display: "flex",
    alignItems: ["flex-end", "center"],
    justifyContent: "flex-end",
    flexDirection: ["column", "row"],
  },
  accountDetailLabel: {
    textTransform: "uppercase",
    fontFamily: "sans-serif",
    fontSize: "0.625rem",
    letterSpacing: "initial",
    color: "gray.300",
    border: "1px solid",
    borderColor: "gray.200",
    borderRadius: 20,
    px: 2,
  },
  accountAddress: {
    ml: 2,
  },
  accountDetailLabelCurrent: {
    backgroundColor: "primary",
    borderColor: "primary",
    color: "black",
    fontWeight: 700,
  },
}

export function AuthzDetailsAccount({account}: {account: Account}) {
  const {currentUser} = useAuthzContext()
  const isCurrent = account.address === currentUser.address
  return (
    <div sx={styles.accountDetail}>
      <div
        sx={{
          ...styles.accountDetailLabel,
          ...(isCurrent ? styles.accountDetailLabelCurrent : {}),
        }}
      >
        {account.label}
      </div>
      <div sx={styles.accountAddress}>{account.address}</div>
    </div>
  )
}

export function AuthzDetailsRow({children}: {children: React.ReactNode}) {
  return <tr sx={styles.row}>{children}</tr>
}

function AuthzDetailsTable({children}: {children: React.ReactNode}) {
  return (
    <table sx={styles.table}>
      <thead>
        <tr>
          <th sx={{minWidth: 100}} />
          <th />
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export default AuthzDetailsTable
