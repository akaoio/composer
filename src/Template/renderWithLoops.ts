import { resolveFromContext } from './resolveFromContext.js'

export function renderWithLoops(this: any, template: string, context?: any): string {
  // Use provided context or fall back to this.context
  const ctx = context || this.context
  
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
    
    // Resolve the array from context
    const array = resolveFromContext(arrayPath.split('.'), ctx)
    
    if (Array.isArray(array)) {
      // Render the loop content for each item
      const renderedItems = array.map((item, index) => {
        // Create a new context with the item
        const itemContext = {
          ...ctx, // Use the passed context
          item,
          index,
          this: item, // Support {{this}} for current item
          '@index': index,
          '@first': index === 0,
          '@last': index === array.length - 1
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
    } else {
      // If not an array, remove the loop block
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
      
      // Resolve the condition value from context
      const conditionValue = resolveFromContext(conditionPath.split('.'), ctx)
      
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