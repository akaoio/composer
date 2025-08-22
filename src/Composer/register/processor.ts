import type { Processor } from '../../type/config.js'

export function processor(this: any, processorDef: Processor): void {
  if (!this.customProcessors) {
    this.customProcessors = []
  }
  
  this.customProcessors.push(processorDef)
  
  if (this.options.verbose) {
    console.log(`📦 Registered custom processor: ${processorDef.name}`)
  }
}