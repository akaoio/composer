import { constructor } from './constructor.js'
import { render } from './render.js'
import { parseVariables } from './parseVariables.js'
import { resolveVariable } from './resolveVariable.js'
import type { CompositionContext, TemplateVariable } from '../type/index.js'

export class Template {
  context!: CompositionContext

  constructor(context: CompositionContext) {
    constructor.call(this, context)
  }

  async render(template: string): Promise<string> {
    return render.call(this, template)
  }

  parseVariables(template: string): TemplateVariable[] {
    return parseVariables.call(this, template)
  }

  resolveVariable(variable: TemplateVariable): string {
    return resolveVariable.call(this, variable)
  }
}

export default Template