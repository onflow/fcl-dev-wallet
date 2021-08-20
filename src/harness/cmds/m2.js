import {mutate} from "@onflow/fcl"
import {yup, nope} from "../util"

export const LABEL = "Mutate 2 (args)"
export const CMD = async () => {
  // prettier-ignore
  return mutate({
    cadence: `
      transaction(a: Int, b: Int, c: Address) {
        prepare(acct: AuthAccount) {
          log(acct)
          log(a)
          log(b)
          log(c)
        }
      }
    `,
    args: (arg, t) => [
      arg(6, t.Int),
      arg(7, t.Int),
      arg("0xba1132bc08f82fe2", t.Address),
    ],
    limit: 50,
  }).then(yup("M-1"))
    .catch(nope("M-1"))
}
