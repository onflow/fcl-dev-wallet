import {mutate} from "@onflow/fcl"
import {yup, nope} from "../util"

export const LABEL = "Mutate 1 (no args)"
export const CMD = async () => {
  // prettier-ignore
  return mutate({
    cadence: `
      transaction() {
        prepare(acct: AuthAccount) {
          log(acct)
        }
      }
    `,
    limit: 50,
  }).then(yup("M-1"))
    .catch(nope("M-1"))
}
