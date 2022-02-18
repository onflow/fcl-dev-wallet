/** @jsxImportSource theme-ui */
import AccountListItemScopes from "components/AccountListItemScopes"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import {styles as dialogStyles} from "components/Dialog"
import FormErrors from "components/FormErrors"
import {Field, Form, Formik} from "formik"
import {useState} from "react"
import {Account, NewAccount, newAccount, updateAccount} from "src/accounts"
import {updateAccountSchemaClient} from "src/validate"
import {Box} from "theme-ui"
import {SXStyles} from "types"
import AccountBalances from "./AccountBalances"
import AuthnActions from "./AuthnActions"
import Button from "./Button"
import {CustomInputComponent} from "./Inputs"

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
}

export default function AccountForm({
  account,
  onSubmitComplete,
  onCancel,
  flowAccountAddress,
  avatarUrl,
}: {
  account: Account | NewAccount
  onSubmitComplete: (createdAccountAddress?: string) => void
  onCancel: () => void
  flowAccountAddress: string
  avatarUrl: string
}) {
  const [errors, setErrors] = useState<string[]>([])

  return (
    <Formik
      initialValues={{
        label: account.label,
        scopes: new Set<string>(account.scopes),
      }}
      validationSchema={updateAccountSchemaClient}
      onSubmit={async ({label, scopes}, {setSubmitting}) => {
        setErrors([])

        const scopesList = Array.from(scopes) as [string]

        try {
          if (account.address) {
            await updateAccount(account.address, label!, scopesList)

            setSubmitting(false)
            onSubmitComplete(undefined)
          } else {
            const address = await newAccount(label!, scopesList)

            setSubmitting(false)
            onSubmitComplete(address)
          }
        } catch (error) {
          // TODO: Fix error string
          // setErrors([error])
          setSubmitting(false)
        }
      }}
    >
      {({values, setFieldValue}) => (
        <>
          <div sx={dialogStyles.body}>
            <Form data-test="fund-account-form" sx={styles.form}>
              <Button onClick={onCancel} sx={styles.backButton}>
                <img src="/back-arrow.svg" />
              </Button>

              <Box mb={4}>
                <ConnectedAppHeader
                  info={false}
                  account={account}
                  title={
                    account.address ? "Manage Account" : "Create New Account"
                  }
                  description={account.address}
                  flowAccountAddress={flowAccountAddress}
                  avatarUrl={avatarUrl}
                />
              </Box>

              <Box mb={4}>
                <Field
                  component={CustomInputComponent}
                  inputLabel="Label"
                  name="label"
                  placeholder="Account label"
                  required
                />
              </Box>

              {!!account.address && (
                <Box mb={4}>
                  <AccountBalances
                    address={account.address}
                    flowAccountAddress={flowAccountAddress}
                  />
                </Box>
              )}

              <Box mb={5}>
                <AccountListItemScopes
                  scopes={values.scopes}
                  setScopes={newScopes => setFieldValue("scopes", newScopes)}
                  compact={true}
                />
              </Box>

              {errors.length > 0 && <FormErrors errors={errors} />}
            </Form>
          </div>
          <div sx={dialogStyles.footer}>
            <AuthnActions account={account} onCancel={onCancel} />
          </div>
        </>
      )}
    </Formik>
  )
}
