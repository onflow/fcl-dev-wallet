export function safe<T>(dx: T) {
  return Array.isArray(dx) ? dx : []
}
