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
  
  // Then handle simple variable replacements
  const variables = this.parseVariables(rendered)
  
  for (const variable of variables) {
    const value = this.resolveVariable(variable)
    rendered = rendered.replace(variable.original, value)
  }
  
  return rendered
}