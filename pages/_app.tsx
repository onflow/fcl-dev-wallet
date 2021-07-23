import Dialog from "components/Dialog"
import {AppProps} from "next/dist/next-server/lib/router/router"
import reply from "src/reply"
import theme from "src/theme"
import {SWRConfig} from "swr"
import {ThemeProvider} from "theme-ui"
import "../styles/globals.css"
import "./fonts.css"

function MyApp({Component, pageProps}: AppProps) {
  const onClose = () => reply("FCL:FRAME:CLOSE")
  return (
    <ThemeProvider theme={theme}>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then(res => res.json()),
        }}
      >
        <Dialog onClose={onClose}>
          <Component {...pageProps} />
        </Dialog>
      </SWRConfig>
    </ThemeProvider>
  )
}

export default MyApp
