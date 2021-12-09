/** @jsxImportSource theme-ui */
import AccountListItemScopes from "components/AccountListItemScopes"
import Button from "components/Button"
import ConnectedAppHeader from "components/ConnectedAppHeader"
import FormErrors from "components/FormErrors"
import {Field, Form, Formik} from "formik"
import {Account, NewAccount} from "pages/api/accounts"
import {useState} from "react"
import {paths} from "src/constants"
import {updateAccountSchemaClient} from "src/validate"
import {mutate} from "swr"
import {Box} from "theme-ui"
import {SXStyles} from "types"
import AccountBalances from "./AccountBalances"
import {CustomInputComponent} from "./Inputs"

const styles: SXStyles = {
  actions: {
    display: "flex",
    flex: 1,
    pt: 20,
    pb: 20,
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
    <div>
      <Formik
        initialValues={{
          label: account.label,
          scopes: new Set(account.scopes),
        }}
        validationSchema={updateAccountSchemaClient}
        onSubmit={({label, scopes}, {setSubmitting}) => {
          setErrors([])
          const url = account.address
            ? paths.apiAccountUpdate(account.address)
            : paths.apiAccountsNew
          const data = {
            address: account.address,
            label,
            scopes: Array.from(scopes),
          }
          fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
          })
            .then(d => d.json())
            .then(resp => {
              if (resp.errors) throw Error(resp.errors)
              const isNew = !account.address
              mutate(paths.apiAccounts).then(() => {
                setSubmitting(false)
                onSubmitComplete(isNew ? resp.address : undefined)
              })
            })
            .catch(e => {
              setErrors([e.message])
              setSubmitting(false)
            })
        }}
      >
        {({values, setFieldValue, isSubmitting, isValid}) => (
          <Form data-test="fund-account-form">
            <Box mb={4}>
              <ConnectedAppHeader
                info={false}
                account={account}
                title={
                  account.address ? "Manage Account" : "Create New Account"
                }
                externalAddressLink={account.address}
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

            <Box mb={4}>
              <AccountListItemScopes
                scopes={values.scopes}
                setScopes={newScopes => setFieldValue("scopes", newScopes)}
                compact={true}
              />
            </Box>

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
                type="submit"
                block
                size="lg"
                sx={{flex: 1, ml: 10, w: "50%"}}
                disabled={isSubmitting || !isValid}
              >
                {account.address ? "Save" : "Create"}
              </Button>
            </div>

            {errors.length > 0 && <FormErrors errors={errors} />}
          </Form>
        )}
      </Formik>
    </div>
  )
}
