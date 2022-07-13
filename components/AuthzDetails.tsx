/** @jsxImportSource theme-ui */
import useAuthzContext from "hooks/useAuthzContext"
import {SXStyles} from "types"
import AuthzDetailsTable, {
  AuthzDetailsAccount,
  AuthzDetailsRow,
} from "./AuthzDetailsTable"
import Code from "./Code"

const styles: SXStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100%",
    mx: [-15, -30],
  },
  wrappedValue: {
    width: [170, 200],
    overflowWrap: "break-word",
    textAlign: "right",
    ml: "auto",
  },
  codeContainer: {
    mt: 3,
    mb: -20,
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
    template,
    isAudited,
  } = useAuthzContext()
  return (
    <div sx={styles.container}>
      <div
        sx={{
          px: [15, 30],
          display: "flex",
          flexDirection: "column",
          "overflow-x": "hidden",
        }}
      >
        { template && (
          <div
            sx={{
              pb: 30
            }}
          >
            <AuthzDetailsTable>
              <AuthzDetailsRow>
                <td fontSize="20">Title</td>
                <td>
                  <div sx={{...styles.wrappedValue, fontWeight: 900, letterSpacing: "0"}}>
                    {template?.data.messages?.title?.i18n?.["en-US"]}
                  </div>
                </td>
              </AuthzDetailsRow>
              <AuthzDetailsRow>
                <td>Description</td>
                <td>
                  <div sx={{...styles.wrappedValue, fontWeight: 900, letterSpacing: "0"}}>
                    {template?.data.messages?.description?.i18n?.["en-US"]}
                  </div>
                </td>
              </AuthzDetailsRow>
              { isAudited && 
                <>
                  <AuthzDetailsRow>
                    <td>Audited</td>
                    <td>
                      <div sx={{...styles.wrappedValue, fontWeight: 900, color: "blue"}}>
                        AUDITED ✓
                      </div>
                    </td>
                  </AuthzDetailsRow>
                </>
              }
            </AuthzDetailsTable>
            { isAudited && 
              <div 
                sx={{
                  width: "100%",
                  boxSizing: "border-box",
                  letterSizing: "initial",
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px",
                  textAlign: "center",
                  mt:15
                }}
              >
                This transaction has been audited for correctness and safety by KittyItems AUDIT
              </div>
            }
          </div>
        )}

        { template && args.map((arg, argIndex) => {
          let found = Object.keys(template?.data?.arguments || []).map(argKey => {
            let argVal = template?.data?.arguments?.[argKey]
            if (argVal.index !== argIndex) return null
            return {argVal, argKey}
          }).filter(el => el !== null)

          if (!found) return null

          let foundTemplateArg = found[0].argVal
          let foundTemplateArgLabel = found[0].argKey

          return (
            <div
              sx={{
                pb: 30
              }}
            >
              <AuthzDetailsTable>
                <AuthzDetailsRow>
                  <td fontSize="20">Argument {argIndex} {foundTemplateArgLabel}</td>
                  <td>
                    <div sx={{...styles.wrappedValue, fontWeight: 900, letterSpacing: "0"}}>
                      {template?.data.arguments?.[foundTemplateArgLabel]?.messages?.title?.i18n?.["en-US"]}
                    </div>
                  </td>
                </AuthzDetailsRow>
                <AuthzDetailsRow>
                  <td fontSize="20">Argument {argIndex} {foundTemplateArgLabel} Value</td>
                  <td>
                    <div sx={{...styles.wrappedValue, fontWeight: 900, letterSpacing: "0"}}>
                      {arg.value}
                    </div>
                  </td>
                </AuthzDetailsRow>
              </AuthzDetailsTable>
            </div>
          )
        })}

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
        <div sx={styles.codeContainer}>
          <Code title="Arguments" value={JSON.stringify(args, null, 2)} />
          <Code title="Script Source Code" value={cadence} />
        </div>
      </div>
    </div>
  )
}

export default AuthzDetails
