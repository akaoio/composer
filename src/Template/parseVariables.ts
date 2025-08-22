import type { TemplateVariable } from '../type/index.js'

export function parseVariables(this: any, template: string): TemplateVariable[] {
  const variables: TemplateVariable[] = []
  
  // Pattern: {{path.to.value}} - Generic variable resolution
  const variableRegex = /\{\{([^}]+)\}\}/g
  let match
  
  while ((match = variableRegex.exec(template)) !== null) {
    const pathString = match[1].trim()
    
    // Skip empty variable names
    if (!pathString) {
      continue
    }
    
    // Skip variables with special characters (only allow alphanumeric, dots, brackets, underscores, and minus for negative indices)
    if (!/^[a-zA-Z0-9_.\[\]\-]+$/.test(pathString)) {
      continue
    }
    
    // Parse path with support for array bracket notation
    const path: string[] = []
    let current = ''
    let inBrackets = false
    
    for (let i = 0; i < pathString.length; i++) {
      const char = pathString[i]
      
      if (char === '[') {
        // Push accumulated segment before bracket
        if (current) {
          path.push(current)
          current = ''
        }
        inBrackets = true
      } else if (char === ']') {
        // Push bracket content as array index
        if (inBrackets && current) {
          path.push(current)
          current = ''
        }
        inBrackets = false
      } else if (char === '.' && !inBrackets) {
        // Dot separator outside brackets
        if (current) {
          path.push(current)
          current = ''
        }
      } else {
        // Accumulate characters
        current += char
      }
    }
    
    // Push any remaining segment
    if (current) {
      path.push(current)
    }
    
    // Only add if path is not empty
    if (path.length > 0) {
      variables.push({
        path: path,
        original: match[0],
        value: undefined // Will be resolved at render time
      })
    }
  }
  
  return variables
}