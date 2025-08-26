import { resolveFromContext } from './resolveFromContext.js'

// Parse helper call syntax like (eq ROLE "coordinator") or (and condition1 condition2)
export function parseHelperCall(this: any, expression: string, context: any): any {
  // Remove outer parentheses and trim
  const trimmed = expression.replace(/^\(|\)$/g, '').trim()
  
  // Parse helper name and arguments
  const parts = this.parseHelperArguments(trimmed)
  if (parts.length === 0) return false
  
  const helperName = parts[0]
  const args = parts.slice(1)
  
  // Get the helper function
  const helper = this.helpers?.get(helperName)
  if (!helper) {
    console.warn(`Unknown helper: ${helperName}`)
    return false
  }
  
  // Resolve arguments from context
  const resolvedArgs = args.map((arg: string) => {
    // Handle string literals (quoted)
    if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
      return arg.slice(1, -1) // Remove quotes
    }
    
    // Handle number literals
    const num = Number(arg)
    if (!isNaN(num) && isFinite(num)) {
      return num
    }
    
    // Handle boolean literals
    if (arg === 'true') return true
    if (arg === 'false') return false
    if (arg === 'null') return null
    if (arg === 'undefined') return undefined
    
    // Resolve as variable path
    return resolveFromContext(arg.split('.'), context)
  })
  
  // Call the helper with resolved arguments
  try {
    return helper(...resolvedArgs)
  } catch (error) {
    console.warn(`Error calling helper ${helperName}:`, error)
    return false
  }
}

// Parse helper arguments handling quotes and nested calls
export function parseHelperArguments(this: any, input: string): string[] {
  const args: string[] = []
  let current = ''
  let inQuotes = false
  let quoteChar = ''
  let parenDepth = 0
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    
    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true
      quoteChar = char
      current += char
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false
      quoteChar = ''
      current += char
    } else if (!inQuotes && char === '(') {
      parenDepth++
      current += char
    } else if (!inQuotes && char === ')') {
      parenDepth--
      current += char
    } else if (!inQuotes && parenDepth === 0 && char === ' ') {
      if (current.trim()) {
        args.push(current.trim())
        current = ''
      }
    } else {
      current += char
    }
  }
  
  if (current.trim()) {
    args.push(current.trim())
  }
  
  return args
}