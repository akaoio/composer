import type { TemplateVariable } from '../type/index.js'

export function resolveVariable(this: any, variable: TemplateVariable): string {
  switch (variable.type) {
    case 'particle':
      return resolveParticle.call(this, variable.path)
    
    case 'component':
      return resolveComponent.call(this, variable.path)
    
    case 'custom':
      return resolveCustom.call(this, variable.path)
    
    default:
      return variable.original
  }
}

function resolveParticle(this: any, path: string[]): string {
  const [category, name, field] = path
  
  const particle = this.context.particles[category]?.[name]
  if (!particle) {
    console.warn(`Particle not found: ${category}.${name}`)
    return ''
  }
  
  const value = particle[field as keyof typeof particle]
  return typeof value === 'string' ? value : String(value || '')
}

function resolveComponent(this: any, path: string[]): string {
  const [name, field] = path
  
  const component = this.context.components[name]
  if (!component) {
    console.warn(`Component not found: ${name}`)
    return ''
  }
  
  if (field === 'template' && component.compose?.template) {
    // Recursively render component template
    return this.render(component.compose.template)
  }
  
  const value = component[field as keyof typeof component]
  return typeof value === 'string' ? value : String(value || '')
}

function resolveCustom(this: any, path: string[]): string {
  let current: any = this.context
  
  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment]
    } else {
      console.warn(`Custom path not found: ${path.join('.')}`)
      return ''
    }
  }
  
  return typeof current === 'string' ? current : String(current || '')
}