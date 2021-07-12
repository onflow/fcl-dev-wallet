import {config as fclConfig} from "@onflow/fcl"
import config from "./config"

fclConfig()
  .put("accessNode.api", config.flowAccessNode)
  .put("0xSERVICE", config.flowAccountAddress)
