/** @jsxImportSource theme-ui */
import useVariants from "hooks/useVariants"
import {useRef} from "react"
import {Button as ThemeUIButton, Link, ThemeUICSSObject} from "theme-ui"

type Props = {
  variant?: "primary" | "secondary" | "ghost" | "link" | "unstyled"
  size?: "xs" | "sm" | "md" | "lg"
  block?: boolean
  sx?: ThemeUICSSObject
  disabled?: boolean
  type?: "submit" | "button" | "reset"
  href?: string
  target?: "_blank"
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  children: React.ReactNode
}

const Button = ({
  variant = "primary",
  size = "md",
  block = false,
  sx = {},
  disabled,
  href,
  target,
  ...props
}: Props) => {
  const ref = useRef<HTMLButtonElement>(null)
  const variants = useVariants([
    `buttons.${disabled ? "disabled" : variant}`,
    `buttons.sizes.${size}`,
    `${variant === "unstyled" ? "buttons.unstyled" : ""}`,
  ])

  const style: ThemeUICSSObject = {
    display: "inline-flex",
    cursor: "pointer",
    textTransform: "uppercase",
    alignItems: "center",
    justifyContent: "center",
    width: block ? "100%" : "auto",
    m: 0,
    border: 0,
    borderRadius: 4,
    textDecoration: "none",
    fontFamily: "body",
    "&:hover": {
      opacity: 0.9,
    },
    ...variants,
    ...sx,
  }

  if (!!href) {
    return (
      <Link href={href} sx={style} target={target} {...props}>
        {props.children}
      </Link>
    )
  }

  return (
    <ThemeUIButton {...props} sx={style} ref={ref} disabled={disabled}>
      {props.children}
    </ThemeUIButton>
  )
}

export default Button
