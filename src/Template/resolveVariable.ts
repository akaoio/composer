import type { TemplateVariable } from '../type/index.js'

export function resolveVariable(this: any, variable: TemplateVariable): string {
  // Try resolving from the full context first, then from context.data
  const resolveFromRoot = (path: string[], root: any): any => {
    let current = root
    
    for (const segment of path) {
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

  // Try resolving from context.data first (for {{title}} -> context.data.title)
  let result = resolveFromRoot(variable.path, this.context?.data)
  
  // If not found, try from full context (for {{data.title}} -> context.data.title)
  if (result == null && this.context) {
    result = resolveFromRoot(variable.path, this.context)
  }
  
  // If still not found, return empty string for missing variables
  if (result == null) {
    return ''
  }
  
  // If it's a function, call it
  if (typeof result === 'function') {
    try {
      return String(result())
    } catch (error) {
      console.warn(`Error calling function ${variable.path.join('.')}: ${error}`)
      return ''
    }
  }
  
  // Smart object resolution: if result is an object, try to find a meaningful value
  if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
    // Check if it's a Promise (for async functions)
    if (result instanceof Promise || (result.then && typeof result.then === 'function')) {
      return ''  // Return empty string for Promises
    }
    
    // If the object has a property with the same name as the last segment of the path,
    // it might be a nested structure where we need to go one level deeper
    const lastSegment = variable.path[variable.path.length - 1]
    if (lastSegment in result) {
      return String(result[lastSegment])
    }
    
    // Try common content properties
    const contentKeys = ['content', 'value', 'text', 'data']
    for (const key of contentKeys) {
      if (key in result) {
        return String(result[key])
      }
    }
    
    // If it's still an object, return empty string for cleaner output
    return ''
  }
  
  return String(result)
}