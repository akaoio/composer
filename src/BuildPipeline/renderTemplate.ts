import { Template } from '../Template/index.js'

export async function renderTemplate(this: any, template: string, context: any): Promise<string> {
  const templateInstance = new Template(template, context)
  return templateInstance.render()
}