import { Template } from '../Template/index.js'
import type { Document, DocumentSection } from '../type/index.js'

export async function composeDocument(this: any, document: Document): Promise<string> {
  const template = new Template(this.context)
  let content = ''
  
  // Process main template
  if (document.template) {
    content = await template.render(document.template)
  }
  
  // Process sections
  if (document.sections && document.sections.length > 0) {
    for (const section of document.sections) {
      content += await composeSection.call(this, section, template)
    }
  }
  
  return content
}

async function composeSection(this: any, section: DocumentSection, template: Template): Promise<string> {
  let sectionContent = ''
  
  if (section.title) {
    sectionContent += `\n## ${section.title}\n\n`
  }
  
  if (section.template) {
    sectionContent += await template.render(section.template)
  }
  
  // Process particle references in section
  if (section.particles && section.particles.length > 0) {
    for (const ref of section.particles) {
      const particle = this.context.particles[ref.category]?.[ref.name]
      if (particle && particle.content) {
        sectionContent += particle.content + '\n\n'
      }
    }
  }
  
  // Process component references in section
  if (section.components && section.components.length > 0) {
    for (const componentName of section.components) {
      const component = this.context.components[componentName]
      if (component && component.compose?.template) {
        sectionContent += await template.render(component.compose.template) + '\n\n'
      }
    }
  }
  
  return sectionContent
}