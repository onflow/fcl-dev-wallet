/** @jsxImportSource theme-ui */
import useAppConfig from "hooks/useConnectedAppConfig"
import {avatar} from "src/avatar"
import {ThemeUICSSObject} from "theme-ui"

interface Props {
  address: string
  sxStyles?: ThemeUICSSObject
}

const styles = {
  border: "1px solid",
  borderColor: "gray.200",
  display: "flex",
  alignItems: "center",
}

export default function AccountImage({address, sxStyles = {}}: Props) {
  const {connectedAppConfig} = useAppConfig()

  return (
    <div sx={{...styles, ...sxStyles}}>
      {connectedAppConfig && (
        <img src={avatar(`${address}-${connectedAppConfig?.app?.title}`)} />
      )}
    </div>
  )
}
