import {FlowTheme} from "src/theme"
import {ThemeUIContextValue, useThemeUI as themeUIUseThemeUI} from "theme-ui"

interface FlowThemeContextValue extends Omit<ThemeUIContextValue, "theme"> {
  theme: FlowTheme
}

const useThemeUI = themeUIUseThemeUI as unknown as () => FlowThemeContextValue

export default useThemeUI
