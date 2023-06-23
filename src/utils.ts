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
export async function updatePollingSession(baseUrl: string, data: any) {
  const body = {
    pollingId: getPollingId(),
    data,
  }

  const response = await fetch(baseUrl + "/api/polling-session", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to update polling session")
  }

  // window.close() needs to be called at the end of a backchannel flow
  // to support Android devices where the parent FCL instance is unable
  // to dismiss the child window.
  window.close()
}

export function getBaseUrl() {
  return window.location.origin
}
