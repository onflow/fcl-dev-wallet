import {AppProps} from "next/app"
import theme from "src/theme"
import {ThemeProvider} from "theme-ui"
import "../styles/globals.css"
import "./fonts.css"

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
