/** @jsxImportSource theme-ui */
import * as fcl from "@onflow/fcl"
import {avatar} from "src/avatar"
import publicConfig from "src/publicConfig"
import {ThemeUICSSObject} from "theme-ui"

interface Props {
  address?: string
  src?: string
  seed: string
  sxStyles?: ThemeUICSSObject
  lg?: boolean
}

const styles = {
  border: "1px solid",
  borderColor: "gray.200",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  "> img": {
    width: "100%",
  },
}

export default function AccountImage({
  address = "",
  src,
  seed,
  sxStyles = {},
  lg,
}: Props) {
  const size = lg ? 65 : 40
  const prefixedAddress = fcl.withPrefix(address)
  const isServiceAccount =
    prefixedAddress === fcl.withPrefix(publicConfig.flowAccountAddress)
  const defaultSrc = isServiceAccount
    ? "/settings.svg"
    : avatar(`${prefixedAddress}-${seed}`)

  return (
    <div
      sx={{
        ...styles,
        ...sxStyles,
        width: size,
        height: size,
        borderRadius: size,
        border: isServiceAccount ? 0 : sxStyles.border || styles.border,
      }}
    >
      <img src={src || defaultSrc} />
    </div>
  )
}
