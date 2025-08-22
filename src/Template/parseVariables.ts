import type { TemplateVariable } from '../type/index.js'

export function parseVariables(this: any, template: string): TemplateVariable[] {
  const variables: TemplateVariable[] = []
  
  // Pattern: {{particles.category.name.field}}
  const particleRegex = /\{\{particles\.([^.]+)\.([^.]+)\.([^}]+)\}\}/g
  let match
  
  while ((match = particleRegex.exec(template)) !== null) {
    variables.push({
      type: 'particle',
      path: [match[1], match[2], match[3]], // [category, name, field]
      original: match[0]
    })
  }
  
  // Pattern: {{components.name.template}}
  const componentRegex = /\{\{components\.([^.]+)\.([^}]+)\}\}/g
  
  while ((match = componentRegex.exec(template)) !== null) {
    variables.push({
      type: 'component',
      path: [match[1], match[2]], // [name, field]
      original: match[0]
    })
  }
  
  // Pattern: {{custom.path.to.value}}
  const customRegex = /\{\{([^}]+)\}\}/g
  
  while ((match = customRegex.exec(template)) !== null) {
    // Skip if already processed as particle or component
    if (match[0].includes('particles.') || match[0].includes('components.')) {
      continue
    }
    
    variables.push({
      type: 'custom',
      path: match[1].split('.'),
      original: match[0]
    })
  }
  
  return variables
}