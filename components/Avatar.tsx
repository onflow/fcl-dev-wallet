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

  return (
    <div sx={styles}>
      {connectedAppConfig && (
        <img
          className="avatar"
          src={avataaar(`${address}-${connectedAppConfig?.app?.title}`)}
        />
      )}
    </div>
  )
}
