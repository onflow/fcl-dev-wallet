import publicConfig from "./publicConfig"

export const avatar = (hash: string): string =>
  encodeURI(`${publicConfig.avatarUrl}avatar/${hash}.svg`)
