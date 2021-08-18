/** @jsxImportSource theme-ui */
import {SXStyles} from "types"
import Button from "./Button"

const styles: SXStyles = {
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    bottom: 0,
    borderTop: "1px solid",
    borderColor: "gray.200",
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    px: 20,
  },
  actions: {
    display: "flex",
    flex: 1,
    pt: 20,
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
