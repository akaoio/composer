import type { CompositionContext } from '../type/index.js'

export function constructor(this: any, context: CompositionContext) {
  this.context = context
}