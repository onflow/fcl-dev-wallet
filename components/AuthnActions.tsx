/** @jsxImportSource theme-ui */
import {useFormikContext} from "formik"
import {Account, NewAccount} from "pages/api/accounts"
import {SXStyles} from "types"
import Button from "./Button"

const styles: SXStyles = {
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

function AuthnActions({
  account,
  onCancel,
}: {
  account: Account | NewAccount
  onCancel: () => void
}) {
  const {isSubmitting, isValid, submitForm} = useFormikContext()

  return (
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
          disabled={isSubmitting || !isValid}
          onClick={submitForm}
        >
          {account.address ? "Save" : "Create"}
        </Button>
      </div>
    </div>
  )
}

export default AuthnActions
