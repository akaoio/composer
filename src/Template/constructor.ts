import type { RenderContext } from '../type/index.js'

export function constructor(this: any, context: RenderContext) {
  this.context = context
}