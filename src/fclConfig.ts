import {config} from "@onflow/fcl"

config()
  .put("accessNode.api", process.env.FLOW_ACCESS_NODE)
  .put("0xSERVICE", process.env.FLOW_ACCOUNT_ADDRESS)
