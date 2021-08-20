import {AppProps} from "next/app"
import theme from "src/theme"
import {SWRConfig} from "swr"
import {ThemeProvider} from "theme-ui"
import "../styles/globals.css"
import "./fonts.css"

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then(res => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </ThemeProvider>
  )
}

export default MyApp
