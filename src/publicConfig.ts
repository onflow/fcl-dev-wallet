export type PublicConfig = {
  avataaarUrl: string
}

const avataaarUrl = process.env.NEXT_PUBLIC_AVATAAAR_URL
if (!avataaarUrl) throw "Missing NEXT_PUBLIC_AVATAAAR_URL"

const publicConfig: PublicConfig = {
  avataaarUrl,
}

export default publicConfig
