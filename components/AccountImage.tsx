/** @jsxImportSource theme-ui */
import useAppConfig from "hooks/useConnectedAppConfig"
import {avataaar} from "src/avataaar"
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
        <img src={avataaar(`${address}-${connectedAppConfig?.app?.title}`)} />
      )}
    </div>
  )
}
