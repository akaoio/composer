import { constructor } from './constructor.js'
import { render } from './render.js'
import { parseVariables } from './parseVariables.js'
import { resolveVariable } from './resolveVariable.js'
import { renderWithLoops } from './renderWithLoops.js'
import { resolveData } from './resolveData.js'
import type { RenderContext, TemplateVariable } from '../type/index.js'

export class Template {
  template: string
  context?: RenderContext

  constructor(template: string, context?: RenderContext) {
    this.template = template
    this.context = context
  }

  render(context?: RenderContext): string {
    if (context) {
      this.context = context
    }
    return render.call(this, this.template)
  }

  parseVariables(template: string): TemplateVariable[] {
    return parseVariables.call(this, template)
  }

  resolveVariable(variable: TemplateVariable): string {
    return resolveVariable.call(this, variable)
  }
  
  renderWithLoops(template: string, context?: any): string {
    return renderWithLoops.call(this, template, context)
  }
  
  resolveData(path: string[]): any {
    return resolveData.call(this, path)
  }
}

export default Template