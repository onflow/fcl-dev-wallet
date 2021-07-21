import {config as fclConfig} from "@onflow/fcl"
import config from "./config"
import publicConfig from "./publicConfig"

fclConfig()
  .put("accessNode.api", config.flowAccessNode)
  .put("0xSERVICE", publicConfig.flowAccountAddress)
