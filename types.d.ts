import {ThemeUICSSObject} from "theme-ui"
import '@emotion/react'
import { FlowTheme } from "./src/theme";

// https://emotion.sh/docs/typescript#define-a-theme
declare module '@emotion/react' {
  export interface Theme extends FlowTheme {}
}

export type SXStyles = Record<string, ThemeUICSSObject>
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>
