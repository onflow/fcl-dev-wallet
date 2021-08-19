/** @jsxImportSource theme-ui */
import * as fcl from "@onflow/fcl"
import {Img} from "react-image"
import {avatar} from "src/avatar"
import {ThemeUICSSObject} from "theme-ui"

interface Props {
  address?: string
  src?: string
  seed: string
  sxStyles?: ThemeUICSSObject
  lg?: boolean
  flowAccountAddress: string
  avatarUrl: string
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
  flowAccountAddress,
  avatarUrl,
}: Props) {
  const size = lg ? 65 : 40
  const prefixedAddress = fcl.withPrefix(address)
  const isServiceAccount =
    prefixedAddress === fcl.withPrefix(flowAccountAddress)
  const defaultSrc = isServiceAccount
    ? "/settings.svg"
    : avatar(avatarUrl, `${prefixedAddress}-${seed}`)

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
      <Img src={[src || defaultSrc, "/missing-avatar-icon.svg"]} />
    </div>
  )
}
