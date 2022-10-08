import {SpinnerCircularFixed} from "spinners-react"
import theme from "../src/theme"

export function Loading() {
  return (
    <SpinnerCircularFixed
      size={50}
      thickness={100}
      speed={100}
      color={theme.colors.primary}
      secondaryColor={theme.colors.gray["500"]}
    />
  )
}
