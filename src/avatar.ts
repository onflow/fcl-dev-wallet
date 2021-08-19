export const avatar = (avatarUrl: string, hash: string): string =>
  encodeURI(`${avatarUrl}avatar/${hash}.svg`)
