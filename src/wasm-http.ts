import path from "path"
import "./wasm-exec"
import {promisify} from "util"
import {readFile} from "fs"

const WASM_PATH = path.resolve("./api.wasm")

const handlerPromise = new Promise(setHandler => {
  const global = globalThis as any
  global.wasmhttp = {
    path: "",
    setHandler,
  }
})

;(async () => {
  const go = new ((globalThis as any).Go as any)()
  go.argv = ["api.wasm"]
  WebAssembly.instantiate(
    await promisify(readFile)(WASM_PATH),
    go.importObject
  ).then(({instance}) => go.run(instance))
})()

export async function requestApi(request: Request) {
  return handlerPromise.then(handler => (handler as any)(request))
}
