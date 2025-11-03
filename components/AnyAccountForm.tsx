/** @jsxImportSource theme-ui */
import ConnectedAppHeader from "components/ConnectedAppHeader"
import {styles as dialogStyles} from "components/Dialog"
import {Field, Form, Formik} from "formik"
import {useState} from "react"
import {Account, addExistingAccount} from "src/accounts"
import {getBaseUrl} from "src/utils"
import {Box} from "theme-ui"
import {SXStyles} from "types"
import useAuthnContext from "hooks/useAuthnContext"
import useConfig from "hooks/useConfig"
import Button from "./Button"
import {CustomInputComponent} from "./Inputs"
import {chooseAccount} from "src/accountAuth"

const styles: SXStyles = {
  form: {
    position: "relative",
  },
  backButton: {
    background: "none",
    border: 0,
    position: "absolute",
    top: 0,
    left: 0,
    cursor: "pointer",
    p: 0,
    zIndex: 10,
  },
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    borderTop: "1px solid",
    borderColor: "gray.200",
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    px: [10, 20],
  },
  actions: {
    display: "flex",
    flex: 1,
    pt: 20,
    pb: 20,
  },
}

type FormValues = {
  address: string
  label: string
}

export default function AnyAccountForm({
  onCancel,
  flowAccountAddress,
  flowAccountPrivateKey,
  avatarUrl,
}: {
  onCancel: () => void
  flowAccountAddress: string
  flowAccountPrivateKey: string
  avatarUrl: string
}) {
  const baseUrl = getBaseUrl()
  const config = useConfig()
  const {connectedAppConfig, appScopes} = useAuthnContext()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <Formik<FormValues>
      initialValues={{
        address: "",
        label: "",
      }}
      validate={values => {
        const errors: Record<string, string> = {}
        if (!values.address) errors.address = "Address is required"
        return errors
      }}
      onSubmit={async values => {
        setError(null)
        setSubmitting(true)
        try {
          // First, add the account to FCL storage
          await addExistingAccount(
            config,
            values.address,
            values.label || values.address,
            appScopes as [string]
          )

          const account: Account = {
            type: "ACCOUNT",
            address: values.address,
            keyId: 0,
            label: values.label || values.address,
            scopes: appScopes,
          }

          // Then authenticate with it
          await chooseAccount(
            baseUrl,
            flowAccountPrivateKey,
            account,
            new Set(appScopes),
            connectedAppConfig
          )
        } catch (e: unknown) {
          setError(String(e))
          setSubmitting(false)
        }
      }}
    >
      {({submitForm, errors: formErrors}) => (
        <>
          <div sx={dialogStyles.body}>
            <Form sx={styles.form}>
              <Button onClick={onCancel} sx={styles.backButton}>
                <img src="/back-arrow.svg" />
              </Button>

              <Box mb={4}>
                <ConnectedAppHeader
                  info={false}
                  title={"Use Existing Address (Fork Mode)"}
                  description={
                    "Authenticate as any address on the forked network."
                  }
                  flowAccountAddress={flowAccountAddress}
                  avatarUrl={avatarUrl}
                />
              </Box>

              <Box mb={4}>
                <Field
                  component={CustomInputComponent}
                  inputLabel="Address"
                  name="address"
                  placeholder="0x..."
                  required
                />
              </Box>

              <Box mb={5}>
                <Field
                  component={CustomInputComponent}
                  inputLabel="Label (optional)"
                  name="label"
                  placeholder="External account label"
                />
              </Box>

              {error && <div sx={{color: "red", fontSize: 1}}>{error}</div>}
              {Object.values(formErrors).length > 0 && (
                <div sx={{color: "red", fontSize: 1}}>
                  {Object.values(formErrors).join(". ")}
                </div>
              )}
            </Form>
          </div>
          <div sx={dialogStyles.footer}>
            <div sx={styles.actionsContainer}>
              <div sx={styles.actions}>
                <Button
                  onClick={onCancel}
                  type="button"
                  variant="ghost"
                  block
                  size="lg"
                  sx={{flex: 1, mr: 10, w: "50%"}}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  block
                  size="lg"
                  sx={{flex: 1, ml: 10, w: "50%"}}
                  disabled={submitting || Object.values(formErrors).length > 0}
                  onClick={submitForm}
                >
                  Authenticate
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  )
}
