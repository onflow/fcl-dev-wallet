import {query} from "@onflow/fcl"
import {yup, nope} from "../util"

export const LABEL = "Query 2 (args)"
export const CMD = async () => {
  // prettier-ignore
  return query({
    cadence: `
      pub fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    args: (arg, t) => [
      arg(5, t.Int),
      arg(7, t.Int),
    ],
  }).then(yup("Q-1"))
    .catch(nope("Q-1"))
}
