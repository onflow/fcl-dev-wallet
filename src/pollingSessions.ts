/*
Global key-value store for backchannel auth sessions
Key: Session ID
Value: Whatever data to be sent on next FCL backchannel poll

NOTE: This is not acceptable for a production environment and this method of
backchannel communication should be replaced with a more secure method.
*/

import {existsSync, readFileSync, writeFileSync} from "fs"

const POLLING_SESSIONS_FILE = "./.polling-sessions.tmp"
const isDev = () => process.env.NODE_ENV === "development"

/*
 * Manages all polling sessions
 * Needs to be stored in file for dev environment because of hot reloading reseting the global variable
 */
class PollingSessionManager {
  pollingSessions: {[key: string]: any} = {}

  private fetchData() {
    if (isDev()) {
      // get data from file
      if (!existsSync(POLLING_SESSIONS_FILE)) {
        this.pollingSessions = {}
      } else {
        this.pollingSessions = JSON.parse(
          readFileSync(POLLING_SESSIONS_FILE).toString()
        )
      }
    }
  }

  private setData() {
    if (isDev()) {
      // write data to file
      const data = JSON.stringify(this.pollingSessions)
      writeFileSync(POLLING_SESSIONS_FILE, data)
    }
  }

  get(pollingId: string) {
    this.fetchData()
    return this.pollingSessions[pollingId]
  }

  set(pollingId: string, data: any) {
    this.fetchData()
    this.pollingSessions[pollingId] = data
    this.setData()
  }

  delete(pollingId: string) {
    this.fetchData()
    delete this.pollingSessions[pollingId]
    this.setData()
  }
}

const PollingSessions = new PollingSessionManager()
export default PollingSessions
