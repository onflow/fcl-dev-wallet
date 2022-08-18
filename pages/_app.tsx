import {AppProps} from "next/app"
import theme from "src/theme"
import {ThemeProvider} from "theme-ui"
import "../styles/globals.css"
import "./fonts.css"
import * as fcl from "@onflow/fcl"

import {ConfigContextProvider} from "contexts/ConfigContext"

global.fcl = fcl

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ConfigContextProvider>
        <Component {...pageProps} />
      </ConfigContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
