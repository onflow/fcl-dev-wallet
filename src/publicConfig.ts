export type PublicConfig = {
  avataarUrl: string
}

const avataarUrl = process.env.NEXT_PUBLIC_AVATAAR_URL
if (!avataarUrl) throw "Missing NEXT_PUBLIC_AVATAAR_URL"

const publicConfig: PublicConfig = {
  avataarUrl,
}

export default publicConfig
