/** @jsxImportSource theme-ui */
import useAuthzContext from "hooks/useAuthzContext"
import {Box} from "theme-ui"
import {SXStyles} from "types"
import AuthzDetailsTable, {
  AuthzDetailsAccount,
  AuthzDetailsRow,
} from "./AuthzDetailsTable"
import Code from "./Code"

const styles: SXStyles = {
  container: {
    display: "flex",
    flex: 1,
    height: "100%",
    mx: -30,
  },
  wrappedValue: {
    width: [170, 200],
    overflowWrap: "break-word",
    textAlign: "right",
    ml: "auto",
  },
}

function AuthzDetails() {
  const {
    proposer,
    payer,
    authorizers,
    proposalKey,
    computeLimit,
    refBlock,
    args,
    cadence,
  } = useAuthzContext()
  return (
    <div sx={styles.container}>
      <div sx={{px: 30, display: "flex", flexDirection: "column", flex: 1}}>
        <AuthzDetailsTable>
          <AuthzDetailsRow>
            <td>Proposer</td>
            <td>
              <AuthzDetailsAccount account={proposer} />
            </td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Payer</td>
            <td>
              <AuthzDetailsAccount account={payer} />
            </td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Authorizers</td>
            <td>
              {authorizers.map(authorizer => (
                <AuthzDetailsAccount
                  account={authorizer}
                  key={authorizer.address}
                />
              ))}
            </td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Proposal Key</td>
            <td>
              <div sx={styles.wrappedValue}>{proposalKey.keyId}</div>
            </td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Sequence #</td>
            <td>{proposalKey.sequenceNum}</td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Gas Limit</td>
            <td>{computeLimit}</td>
          </AuthzDetailsRow>
          <AuthzDetailsRow>
            <td>Reference Block</td>
            <td>
              <div sx={{...styles.wrappedValue, letterSpacing: "0.25em"}}>
                {refBlock}
              </div>
            </td>
          </AuthzDetailsRow>
        </AuthzDetailsTable>
        <Box mt={3} mb={-20}>
          <Code title="Arguments" value={JSON.stringify(args, null, 2)} />
          <Code title="Script Source Code" value={cadence} />
        </Box>
      </div>
    </div>
  )
}

export default AuthzDetails
