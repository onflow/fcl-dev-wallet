/** @jsxImportSource theme-ui */
import {SXStyles} from "types"
import Button from "./Button"

const styles: SXStyles = {
  actionsContainer: {
    borderTop: "1px solid",
    borderColor: "gray.200",
    backgroundColor: "white",
    mx: -30,
    px: 20,
  },
  actions: {
    display: "flex",
    pt: 30,
    pb: 20,
  },
}

function AuthzActions({
  onApprove,
  onDecline,
  isLoading,
}: {
  onApprove: () => void
  onDecline: () => void
  isLoading?: boolean
}) {
  return (
    <div sx={styles.actionsContainer}>
      <div sx={styles.actions}>
        <Button
          variant="ghost"
          size="lg"
          sx={{flex: 1, mx: 10, w: "50%"}}
          onClick={onDecline}
        >
          Decline
        </Button>
        <Button
          size="lg"
          sx={{flex: 1, mx: 10, w: "50%"}}
          onClick={onApprove}
          disabled={isLoading}
          data-test="approve-transaction-button"
        >
          Approve
        </Button>
      </div>
    </div>
  )
}

export default AuthzActions
