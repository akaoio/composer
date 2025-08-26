import { resolveFromContext } from './resolveFromContext.js'

export function renderWithLoops(this: any, template: string, context?: any): string {
  // Use provided context or fall back to this.context
  let ctx = context || this.context
  
  // If context has a 'data' property, use that as the actual context
  // This handles the common pattern of { data: { ... } }
  if (ctx && ctx.data && typeof ctx.data === 'object') {
    ctx = { ...ctx.data, ...ctx }
  }
  
  // Function to find matching end tag for nested blocks
  const findMatchingEnd = (str: string, startPos: number): number => {
    let depth = 1
    let pos = startPos
    
    while (depth > 0 && pos < str.length) {
      // Look for next {{#each or {{/each
      const nextEach = str.indexOf('{{#each', pos)
      const nextEnd = str.indexOf('{{/each}}', pos)
      
      if (nextEnd === -1) {
        return -1 // No matching end found
      }
      
      // If there's another {{#each before the next {{/each}}, increase depth
      if (nextEach !== -1 && nextEach < nextEnd) {
        depth++
        pos = nextEach + 7 // Move past '{{#each'
      } else {
        depth--
        if (depth === 0) {
          return nextEnd
        }
        pos = nextEnd + 9 // Move past '{{/each}}'
      }
    }
    
    return -1
  }
  
  let result = template
  let processed = true
  
  // Keep processing until no more {{#each blocks are found
  while (processed) {
    processed = false
    
    // Find the first {{#each block
    const eachStart = result.indexOf('{{#each')
    if (eachStart === -1) break
    
    // Find the array name
    const eachEndTag = result.indexOf('}}', eachStart)
    if (eachEndTag === -1) break
    
    const arrayPath = result.substring(eachStart + 7, eachEndTag).trim()
    
    // Find the matching {{/each}} considering nesting
    const contentStart = eachEndTag + 2
    const endPos = findMatchingEnd(result, contentStart)
    
    if (endPos === -1) break
    
    const loopContent = result.substring(contentStart, endPos)
    const fullMatch = result.substring(eachStart, endPos + 9) // Include {{/each}}
    
    // Resolve the array/object from context
    const collection = resolveFromContext(arrayPath.split('.'), ctx)
    
    if (Array.isArray(collection)) {
      // Handle array iteration
      const renderedItems = collection.map((item, index) => {
        // Create a new context with the item
        const itemContext = {
          ...ctx, // Use the passed context
          item,
          index,
          this: item, // Support {{this}} for current item
          '@index': index,
          '@first': index === 0,
          '@last': index === collection.length - 1
        }
        
        // Also spread item properties to top level for easier access
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          Object.keys(item).forEach(key => {
            itemContext[key] = item[key]
          })
        }
        
        // Recursively process the loop content for nested loops
        // First process any nested loops
        let processed = this.renderWithLoops(loopContent, itemContext)
        
        // Then handle variable replacements with the item context
        const variables = this.parseVariables(processed)
        for (const variable of variables) {
          const value = resolveFromContext(variable.path, itemContext)
          if (value !== undefined) {
            processed = processed.replace(variable.original, String(value))
          }
        }
        
        return processed
      })
      
      // Replace the entire loop block with rendered content
      result = result.substring(0, eachStart) + renderedItems.join('') + result.substring(endPos + 9)
      processed = true
    } else if (collection && typeof collection === 'object' && collection !== null) {
      // Handle object iteration
      const entries = Object.entries(collection)
      const renderedItems = entries.map(([key, value], index) => {
        // Create a new context with the key-value pair
        const itemContext = {
          ...ctx, // Use the passed context
          item: value,
          key,
          index,
          this: value, // Support {{this}} for current value
          '@key': key, // Support {{@key}} for object key
          '@value': value, // Support {{@value}} for object value
          '@index': index,
          '@first': index === 0,
          '@last': index === entries.length - 1
        }
        
        // Also spread value properties to top level for easier access if value is an object
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.keys(value).forEach(prop => {
            itemContext[prop] = (value as any)[prop]
          })
        }
        
        // Recursively process the loop content for nested loops
        // First process any nested loops
        let processed = this.renderWithLoops(loopContent, itemContext)
        
        // Then handle variable replacements with the item context
        const variables = this.parseVariables(processed)
        for (const variable of variables) {
          const resolvedValue = resolveFromContext(variable.path, itemContext)
          if (resolvedValue !== undefined) {
            processed = processed.replace(variable.original, String(resolvedValue))
          }
        }
        
        return processed
      })
      
      // Replace the entire loop block with rendered content
      result = result.substring(0, eachStart) + renderedItems.join('') + result.substring(endPos + 9)
      processed = true
    } else {
      // If not an array or object, remove the loop block
      result = result.substring(0, eachStart) + result.substring(endPos + 9)
      processed = true
    }
  }
  
  // Handle {{#if condition}}...{{else}}...{{/if}} blocks
  let hasIfBlocks = true
  while (hasIfBlocks) {
    hasIfBlocks = false
    const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/
    
    const match = ifRegex.exec(result)
    if (match) {
      hasIfBlocks = true
      const conditionPath = match[1].trim()
      const ifContent = match[2]
      const elseContent = match[3] || ''
      const fullMatch = match[0]
      
      let conditionValue: any
      
      // Check if this is a helper call (starts with parentheses)
      if (conditionPath.startsWith('(') && conditionPath.endsWith(')')) {
        // Parse and evaluate helper call
        conditionValue = this.parseHelperCall(conditionPath, ctx)
      } else {
        // Resolve as simple variable path
        conditionValue = resolveFromContext(conditionPath.split('.'), ctx)
      }
      
      // Check if condition is truthy
      const isTruthy = conditionValue && conditionValue !== '' && conditionValue !== '0' && conditionValue !== false
      
      if (isTruthy) {
        // Use the if content
        result = result.replace(fullMatch, ifContent)
      } else {
        // Use the else content (or empty if no else block)
        result = result.replace(fullMatch, elseContent)
      }
    }
  }
  
  return result
}