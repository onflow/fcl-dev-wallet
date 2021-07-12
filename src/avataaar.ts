import publicConfig from "./publicConfig"

export const avataaar = (hash: string): string =>
  `${publicConfig.avataarUrl}avatar/${hash}.svg`
