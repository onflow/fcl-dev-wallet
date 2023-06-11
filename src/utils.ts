export function isBackchannel() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("channel") === "back"
}

export function getPollingId() {
  const urlParams = new URLSearchParams(window.location.search)
  const pollingId = urlParams.get("pollingId")

  if (!pollingId) {
    throw new Error("Missing pollingId")
  }

  return pollingId
}

/*
 * This function is used to update a polling session with data from the frontchannel.
 * It is used to emulate a backchannel response from the frontchannel.
 */
export function updatePollingSession(baseUrl: string, data: any) {
  const body = {
    pollingId: getPollingId(),
    data,
  }

  fetch(baseUrl + "/api/polling-session", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
}
