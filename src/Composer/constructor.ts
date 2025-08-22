import type { RenderContext } from '../type/index.js'
import type { ComposerOptions } from './index.js'

export function constructor(this: any, options: ComposerOptions = {}) {
  this.options = {
    dataPath: options.dataPath || './data',
    templatesPath: options.templatesPath || './templates',
    outputPath: options.outputPath || './output',
    watch: options.watch || false,
    debounceMs: options.debounceMs || 1000,
    ...options
  }

  this.context = {
    data: {},
    variables: {},
    functions: {}
  } as RenderContext

  this.watcher = null
  this.customProcessors = []
}