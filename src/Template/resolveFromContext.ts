export function resolveFromContext(path: string[], data: any): any {
  let current = data
  for (const key of path) {
    if (current && typeof current === 'object') {
      current = current[key]
    } else {
      return undefined
    }
  }
  return current
}