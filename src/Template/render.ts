export function render(this: any, contextOrTemplate?: any): string {
  // Handle overloaded parameters
  let templateContent = this.template
  if (typeof contextOrTemplate === 'string') {
    templateContent = contextOrTemplate
  } else if (contextOrTemplate && typeof contextOrTemplate === 'object') {
    this.context = contextOrTemplate
  }
  
  // First handle loops and conditionals - pass context for nested loops
  let rendered = this.renderWithLoops(templateContent, this.context)
  
  // Then handle simple variable replacements and helper calls
  const variables = this.parseVariables(rendered)
  
  for (const variable of variables) {
    let value
    const variablePath = variable.path.join('.')
    
    // Check if this looks like a helper call (contains spaces and parentheses aren't needed)
    if (variablePath.includes(' ')) {
      // Parse as helper call with context
      try {
        value = this.parseHelperCall(`(${variablePath})`, this.context?.data || this.context)
        value = String(value)
      } catch (error) {
        // Fall back to normal variable resolution
        value = this.resolveVariable(variable)
      }
    } else {
      // Normal variable resolution
      value = this.resolveVariable(variable)
    }
    
    rendered = rendered.replace(variable.original, value)
  }
  
  return rendered
}// Local change test at Mon Aug 25 05:29:39 PM +07 2025
