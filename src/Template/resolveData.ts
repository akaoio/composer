export function resolveData(this: any, path: string[]): any {
  // Helper function to resolve from a root object
  const resolveFromRoot = (segments: string[], root: any): any => {
    let current = root
    
    for (const segment of segments) {
      if (current == null) {
        return null
      }
      
      // Handle array indices (numeric strings including negative)
      if (Array.isArray(current) && /^-?\d+$/.test(segment)) {
        const index = parseInt(segment, 10)
        // Handle negative indices (Python-style)
        const actualIndex = index < 0 ? current.length + index : index
        if (actualIndex >= 0 && actualIndex < current.length) {
          current = current[actualIndex]
        } else {
          return null
        }
      } else if (current && typeof current === 'object' && segment in current) {
        current = current[segment]
      } else {
        return null
      }
    }
    
    return current
  }

  // Try resolving from context.data first
  let result = resolveFromRoot(path, this.context?.data)
  
  // If not found, try from full context
  if (result == null && this.context) {
    result = resolveFromRoot(path, this.context)
  }
  
  // Return the actual data (not stringified)
  return result
}