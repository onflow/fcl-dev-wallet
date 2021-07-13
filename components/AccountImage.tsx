/** @jsxImportSource theme-ui */
import useAppConfig from "hooks/useConnectedAppConfig"
import {avatar} from "src/avatar"
import {ThemeUICSSObject} from "theme-ui"

interface Props {
  address: string
  styles?: ThemeUICSSObject
}

export default function AccountImage({address, styles}: Props) {
  const {connectedAppConfig} = useAppConfig()

  return (
    <div sx={styles}>
      {connectedAppConfig && (
        <img src={avatar(`${address}-${connectedAppConfig?.app?.title}`)} />
      )}
    </div>
  )
}
