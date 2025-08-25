import { Template } from '../Template/index.js'

export function render(this: any, template: string, data: any): string {
  // Simple render function - just process a template with data
  const tmpl = new Template(template)
  return tmpl.render(data)
}