import {currentUser} from "@onflow/fcl"
import {yup, nope} from "../util"

export const LABEL = "User Sign 1 (No Verification)"
export const CMD = async () => {
  const MSG = "FOO"
  // prettier-ignore
  return currentUser()
    .signUserMessage(Buffer.from(MSG).toString("hex"))
    .then(yup("US-1"))
    .catch(nope("US-1"))
}
