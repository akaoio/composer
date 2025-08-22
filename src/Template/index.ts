import { constructor } from './constructor.js'
import { render } from './render.js'
import { parseVariables } from './parseVariables.js'
import { resolveVariable } from './resolveVariable.js'
import type { RenderContext, TemplateVariable } from '../type/index.js'

export class Template {
  template: string
  context?: RenderContext

  constructor(template: string, context?: RenderContext) {
    this.template = template
    if (context) {
      constructor.call(this, context)
    }
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
}

export default Template