/** @jsxImportSource theme-ui */
import * as fcl from "@onflow/fcl"
import useAuthzContext from "hooks/useAuthzContext"
import {useState} from "react"
import {paths} from "src/constants"
import reply from "src/reply"
import {SXStyles} from "types"
import Button from "./Button"

const styles: SXStyles = {
  actionsContainer: {
    borderTop: "1px solid",
    borderColor: "gray.200",
    mt: 20,
    mx: -30,
    px: 20,
  },
  actions: {
    display: "flex",
    pt: 30,
    pb: 20,
  },
}

function AuthzActions() {
  const {currentUser, proposalKey, message, id} = useAuthzContext()
  const [isLoading, setIsLoading] = useState(false)

  const sign = () => {
    setIsLoading(true)
    fetch(paths.apiSign, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: message}),
    })
      .then(d => d.json())
      .then(({signature}) => {
        window.parent.postMessage(
          {
            jsonrpc: "2.0",
            id,
            result: {
              f_type: "PollingResponse",
              f_vsn: "1.0.0",
              status: "APPROVED",
              reason: null,
              data: {
                f_type: "CompositeSignature",
                f_vsn: "1.0.0",
                addr: fcl.sansPrefix(currentUser.address),
                keyId: Number(proposalKey.keyId),
                signature: signature,
              },
            },
          },
          "*"
        )
        setIsLoading(false)
      })
      .catch(d => {
        // eslint-disable-next-line no-console
        console.error("FCL-DEV-WALLET FAILED TO SIGN", d)
        setIsLoading(false)
      })
  }

  return (
    <div sx={styles.actionsContainer}>
      <div sx={styles.actions}>
        <Button
          variant="ghost"
          size="lg"
          sx={{flex: 1, mx: 10, w: "50%"}}
          onClick={() => reply("FCL:FRAME:CLOSE")}
        >
          Decline
        </Button>
        <Button
          size="lg"
          sx={{flex: 1, mx: 10, w: "50%"}}
          onClick={sign}
          disabled={isLoading}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}

export default AuthzActions
