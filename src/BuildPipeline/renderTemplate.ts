import { Template } from '../Template/index.js'

export async function renderTemplate(this: any, template: string, context: any): Promise<string> {
  // Flatten sources for template access
  const flatContext = { ...context }
  
  // If context has sources, flatten them for easier access
  if (context.sources) {
    for (const [key, value] of Object.entries(context.sources)) {
      // If source is an array with one item, use that item directly
      if (Array.isArray(value) && value.length === 1) {
        flatContext[key] = value[0]
      } else {
        flatContext[key] = value
      }
    }
  }
  
  const templateInstance = new Template(template, flatContext)
  return templateInstance.render()
}