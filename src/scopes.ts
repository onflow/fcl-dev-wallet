export const parseScopes = (scopes?: string) =>
  scopes?.trim()?.split(/\s+/) ?? []
