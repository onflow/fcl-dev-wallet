/** @jsxImportSource theme-ui */
import * as fcl from "@onflow/fcl"
import {avatar} from "src/avatar"
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
  const size = lg ? 60 : 40
  return (
    <div
      sx={{
        ...styles,
        ...sxStyles,
        width: size,
        height: size,
        borderRadius: size,
      }}
    >
      <img src={src || avatar(`${fcl.withPrefix(address)}-${seed}`)} />
    </div>
  )
}
