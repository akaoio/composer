export function getDataForPattern(this: any, pattern: string, result: any): any {
  // Handle root case
  if (pattern === '.' || pattern === '') {
    return result
  }
  
  const keys = pattern.split('.')
  let current = result
  
  for (const key of keys) {
    if (key === '') continue
    if (current == null) return undefined
    current = current[key]
  }
  
  return current
}