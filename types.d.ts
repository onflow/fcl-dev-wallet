import {ThemeUICSSObject} from "theme-ui"

export type SXStyles = Record<string, ThemeUICSSObject>
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>
