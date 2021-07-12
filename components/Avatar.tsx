/** @jsxImportSource theme-ui */
import useAppConfig from "hooks/useConnectedAppConfig"
import {avataaar} from "src/avataaar"
import {ThemeUICSSObject} from "theme-ui"

interface Props {
  address: string
  styles?: ThemeUICSSObject
}

export default function Avatar({address, styles}: Props) {
  const {connectedAppConfig} = useAppConfig()
  const hash = encodeURI(`${address}-${connectedAppConfig?.app?.title}`)
  return <img className="avatar" src={avataaar(hash)} sx={styles} />
}
