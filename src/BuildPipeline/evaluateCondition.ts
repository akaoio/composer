export async function evaluateCondition(this: any, condition: string | Function, result: any): Promise<boolean> {
  if (typeof condition === 'function') {
    return await condition(result)
  }
  
  if (typeof condition === 'string') {
    const keys = condition.split('.')
    let current = result
    
    for (const key of keys) {
      if (current == null) return false
      current = current[key]
    }
    
    // Handle falsy values properly - empty arrays, empty strings, 0 should be false
    if (Array.isArray(current) && current.length === 0) return false
    if (current === 0 || current === '' || current === false) return false
    return !!current
  }
  
  return false
}