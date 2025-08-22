export async function render(this: any, template: string): Promise<string> {
  const variables = this.parseVariables(template)
  let rendered = template
  
  for (const variable of variables) {
    const value = this.resolveVariable(variable)
    rendered = rendered.replace(variable.original, value)
  }
  
  return rendered
}