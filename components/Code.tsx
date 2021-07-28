/** @jsxImportSource theme-ui */
import {useMonaco} from "@monaco-editor/react"
import useAuthzContext from "hooks/useAuthzContext"
import {useEffect, useState} from "react"
import configureCadence, {CADENCE_LANGUAGE_ID} from "src/cadence"
import {SXStyles} from "types"
import ExpandCollapseButton from "./ExpandCollapseButton"

const styles: SXStyles = {
  codeContainer: {
    mx: -30,
  },
  block: {
    backgroundColor: "gray.100",
    maxHeight: 120,
    overflow: "auto",
    py: 15,
    px: 30,
  },
  blockExpanded: {
    backgroundColor: "white",
    maxHeight: "auto",
    pl: 1,
    py: 0,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    code: {
      "> span:before": {
        display: "inline-block",
      },
    },
  },
  code: {
    display: "flex",
    flexDirection: "column",
    whiteSpace: "pre",
    "> br": {
      display: "none",
    },
    "> span": {
      counterIncrement: "line",
      "&:first-of-type:before": {
        pt: 2,
      },
      "&:last-of-type:before": {
        pb: 2,
      },
      "&:before": {
        display: "none",
        backgroundColor: "gray.100",
        borderRight: "1px solid",
        borderColor: "gray.300",
        content: "counter(line)",
        color: "gray.500",
        textAlign: "center",
        mr: 3,
        px: "2px",
        minWidth: 20,
      },
    },
  },
  header: {
    height: 30,
    px: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid",
    borderBottom: "1px solid",
    borderColor: "gray.200",
  },
  headerTitle: {
    color: "gray.300",
    textTransform: "uppercase",
    fontSize: 0,
  },
  headerToggle: {},
}

export default function Code({title, value}: {title: string; value: string}) {
  const monaco = useMonaco()
  const [colorizedSafeHtml, setColorizedHtml] = useState("")
  const {isExpanded, setCodePreview} = useAuthzContext()

  useEffect(() => {
    if (monaco) {
      configureCadence(monaco)
      monaco.editor
        .colorize(value, CADENCE_LANGUAGE_ID, {tabSize: 2})
        .then(setColorizedHtml)
    }
  }, [monaco, value])

  return (
    <div sx={styles.codeContainer}>
      <div
        sx={{
          ...styles.header,
          borderTop: isExpanded ? 0 : styles.header.borderTop,
        }}
      >
        <div sx={styles.headerTitle}>{title}</div>
        {!isExpanded && (
          <div sx={styles.headerToggle}>
            <ExpandCollapseButton
              onClick={() => setCodePreview({title, value})}
            />
          </div>
        )}
      </div>
      <div
        sx={{
          ...styles.block,
          ...(isExpanded ? styles.blockExpanded : {}),
        }}
      >
        {colorizedSafeHtml.length > 0 && (
          <code
            sx={styles.code}
            dangerouslySetInnerHTML={{__html: colorizedSafeHtml}}
          />
        )}
      </div>
    </div>
  )
}
