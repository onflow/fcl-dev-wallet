export function isBackchannel() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("channel") === "back"
}

export function getAuthId() {
  const urlParams = new URLSearchParams(window.location.search)
  const authId = urlParams.get("authId")

  if (!authId) {
    throw new Error("Missing authId")
  }

  return authId
}
