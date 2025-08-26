import { constructor } from './constructor.js'
import { render } from './render.js'
import { parseVariables } from './parseVariables.js'
import { resolveVariable } from './resolveVariable.js'
import { renderWithLoops } from './renderWithLoops.js'
import { resolveData } from './resolveData.js'
import { registerHelper } from './registerHelper.js'
import { parseHelperCall, parseHelperArguments } from './parseHelperCall.js'
import { globalHelperRegistry, type HelperFunction } from './helpers.js'
import type { RenderContext, TemplateVariable } from '../type/index.js'

export class Template {
  template: string
  context?: RenderContext
  helpers: typeof globalHelperRegistry

  constructor(template: string, context?: RenderContext) {
    this.template = template
    this.context = context
    this.helpers = globalHelperRegistry
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

  registerHelper(name: string, helper: HelperFunction): void {
    return registerHelper.call(this, name, helper)
  }

  parseHelperCall(expression: string, context: any): any {
    return parseHelperCall.call(this, expression, context)
  }

  parseHelperArguments(input: string): string[] {
    return parseHelperArguments.call(this, input)
  }
}

export default Template