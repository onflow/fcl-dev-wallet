/*
Global key-value store for backchannel auth sessions
Key: Session ID
Value: Whatever data to be sent on next FCL backchannel poll

NOTE: This is not acceptable for a production environment and this method of
backchannel communication should be replaced with a more secure method.
*/
const authSessions: {[id: string]: any} = {}

export default authSessions
