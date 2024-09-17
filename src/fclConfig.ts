import {config} from "@onflow/fcl"
import flowJSON from "../flow.json"

export default function fclConfig(flowAccessNode: string) {
  config().put("accessNode.api", flowAccessNode).put("flow.network", "local")
  config().load({flowJSON})
}
