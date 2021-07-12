/** @jsxImportSource theme-ui */
import useVariants from "hooks/useVariants"
import {Switch as ThemeUISwitch, ThemeUICSSObject} from "theme-ui"

type Props = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  defaultChecked?: boolean
  variant?: "primary"
  size?: "lg"
  sx?: ThemeUICSSObject
  id: string
}

const Switch = ({
  onClick,
  defaultChecked = false,
  variant = "primary",
  size = "lg",
  sx = {},
  id = "",
}: Props) => {
  const variants = useVariants([
    `forms.switch.${variant}`,
    `forms.switch.sizes.${size}`,
  ])
  return (
    <ThemeUISwitch
      onClick={onClick}
      defaultChecked={defaultChecked}
      sx={{...sx, ...variants}}
      id={id}
      role="switch"
    />
  )
}

export default Switch
