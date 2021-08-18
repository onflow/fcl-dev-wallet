export type PublicConfig = {
  avatarUrl: string
  flowAccountAddress: string
}

const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL
if (!avatarUrl) throw "Missing NEXT_PUBLIC_AVATAR_URL"

const flowAccountAddress = process.env.NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS
if (!flowAccountAddress) throw "Missing NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS"

const publicConfig: PublicConfig = {
  avatarUrl,
  flowAccountAddress,
}

export default publicConfig
