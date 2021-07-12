export type PublicConfig = {
  avatarUrl: string
}

const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL
if (!avatarUrl) throw "Missing NEXT_PUBLIC_AVATAR_URL"

const publicConfig: PublicConfig = {
  avatarUrl,
}

export default publicConfig
