import {Theme} from "theme-ui"
import {transparentize} from "@theme-ui/color"

const makeTheme = <T extends Theme>(t: T) => t

const heading = {
  color: "text",
  fontFamily: "heading",
  lineHeight: "heading",
  fontWeight: "heading",
}

const theme = makeTheme({
  space: [
    0,
    "0.25rem",
    "0.5rem",
    "1rem",
    "2rem",
    "4rem",
    "8rem",
    "16rem",
    "32rem",
  ],
  fonts: {
    body: 'Overpass, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: "Overpass Mono, monospace",
  },
  fontSizes: [
    "0.75rem",
    "0.875rem",
    "1rem",
    "1.25rem",
    "1.5rem",
    "2rem",
    "3rem",
    "4rem",
    "6rem",
  ],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: "#30353E",
    textMedium: "#5C626F",
    background: "#fff",
    primary: "#72EA94",
    secondary: "#3545F5",
    muted: "#f6f6f6",
    black: "#000000",
    white: "#ffffff",
    canary: "#e2d849",
    pink: "#FDC4FE",
    green: "#00EF8B",
    blue: "#3545F5",
    red: {
      "100": "#FFEEEB",
      "200": "#E55A3D",
    },
    gray: {
      "100": "#FBFBFB",
      "200": "#E5E5E5",
      "300": "#C8C8C8",
      "400": "#888888",
      "500": "#707070",
      "600": "#505050",
      "700": "#383838",
      "800": "#282828",
      "900": "#101010",
    },
  },
  buttons: {
    primary: {
      color: transparentize("black", 0.25),
      bg: "primary",
      border: "1px solid",
      borderColor: "green",
      outlineColor: "gray.500",
    },
    secondary: {
      color: "background",
      bg: "secondary",
      outlineColor: "gray.300",
    },
    ghost: {
      bg: "transparent",
      border: "1px solid",
      borderColor: "gray.300",
      outlineColor: "gray.800",
      color: "gray.400",
    },
    disabled: {
      cursor: "default",
      opacity: 0.5,
      "&:hover": {
        opacity: 0.5,
      },
    },
    link: {
      color: "blue",
      background: 0,
      border: 0,
      textTransform: "none",
      fontFamily: "sans-serif",
    },
    unstyled: {
      color: "black",
      fontFamily: "inherit",
      border: 0,
      padding: 0,
      backgroundColor: "transparent",
      cursor: "pointer",
      borderRadius: 0,
      letterSpacing: 0.5,
      "&:hover": {
        opacity: 0.75,
      },
      "&:disabled": {
        backgroundColor: "transparent",
      },
    },
    sizes: {
      xs: {
        px: 2,
        py: 1,
        fontSize: 0,
        fontWeight: "normal",
        letterSpacing: "0.06em",
      },
      sm: {
        px: 4,
        py: 2,
        fontSize: 2,
        color: "text",
        fontWeight: 700,
      },
      md: {
        fontSize: 3,
        px: 20,
        paddingTop: 10,
        paddingBottom: 10,
        fontWeight: "bold",
        letterSpacing: 0.5,
      },
      lg: {
        px: 4,
        fontSize: 2,
        paddingTop: 16,
        paddingBottom: 14,
        fontWeight: "bold",
        letterSpacing: 0.5,
      },
    },
  },
  links: {
    underline: {
      color: "textMedium",
      textDecoration: "none",
      borderBottom: "1px solid",
      borderColor: "inherit",
      "&:hover": {
        opacity: 0.8,
      },
    },
    white: {
      color: "white",
      cursor: "pointer",
      textDecoration: "none",
      "&:hover": {
        opacity: 0.8,
      },
    },
    secondary: {
      color: "secondary",
      textDecoration: "none",
      "&:hover": {
        opacity: 0.8,
      },
    },
  },
  text: {
    small: {
      color: "gray.400",
      fontSize: 0,
    },
  },
  forms: {
    label: {
      fontSize: 2,
      fontWeight: 600,
      my: 2,
    },
    select: {
      borderColor: "gray.200",
      outlineColor: "gray.300",
    },
    input: {
      fontFamily: "body",
      borderColor: "gray.200",
      outlineColor: "gray.300",
      px: [10, 20],
    },
    textarea: {
      borderColor: "gray.200",
      resize: "none",
      outlineColor: "gray.300",
      px: [10, 20],
      py: [2, 15],
    },
    switch: {
      backgroundColor: "gray.300",
      display: "flex",
      alignItems: "center",
      marginRight: 0,
      "input:checked ~ &": {
        backgroundColor: "primary",
      },
    },
  },
  breakpoints: ["576px", "768px", "1024px", "1200px"],
  container: {
    maxWidth: 1200,
    px: 3,
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      backgroundColor: "transparent",
      minHeight: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden auto !important",
      paddingTop: 2,
      paddingBottom: 2,
    },
    h1: {
      ...heading,
      fontSize: 5,
      fontWeight: 600,
    },
    h2: {
      ...heading,
      fontSize: 4,
    },
    h3: {
      ...heading,
      fontSize: 3,
    },
    h4: {
      ...heading,
      fontSize: 2,
    },
    h5: {
      ...heading,
      fontSize: 1,
    },
    h6: {
      ...heading,
      fontSize: 0,
    },
    p: {
      color: "textMedium",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      fontSize: 2,
    },
    a: {
      color: "textMedium",
      "&:hover": {
        opacity: 0.8,
      },
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
    small: {
      color: "red",
    },
    hr: {
      border: 0,
      height: "1px",
      backgroundColor: "gray.200",
      my: 4,
    },
  },
})

export type FlowTheme = typeof theme

export default theme
