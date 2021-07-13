// Adds support for multiple variants https://github.com/system-ui/theme-ui/issues/403#issuecomment-561322255

import {useResponsiveValue} from "@theme-ui/match-media"
import theme from "src/theme"
import {get} from "theme-ui"

export default function useVariants(...variantBlocks: string[][]) {
  const variants = useResponsiveValue(variantBlocks)
  let styles = {}
  variants.map((variant: string) => {
    styles = {...styles, ...get(theme, variant)}
  })
  return styles
}
