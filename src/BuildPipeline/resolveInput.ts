export function resolveInput(this: any, input: string | string[]): any {
  if (Array.isArray(input)) {
    // Multiple inputs - merge them
    const result: any = {}
    
    for (const inputKey of input) {
      const resolved = this.resolveInput(inputKey)
      Object.assign(result, resolved)
    }
    
    return result
  }
  
  // Single input - resolve with dot notation support
  const parts = input.split('.')
  let current = this.context
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return {}
    }
  }
  
  return current
}