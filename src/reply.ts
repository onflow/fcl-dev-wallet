export default function reply(type: string, msg = {}) {
  window.parent.postMessage({...msg, type}, "*")
}
