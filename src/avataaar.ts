import publicConfig from "./publicConfig"

export const avataaar = (hash: string): string =>
  encodeURI(`${publicConfig.avataaarUrl}avatar/${hash}.svg`)
