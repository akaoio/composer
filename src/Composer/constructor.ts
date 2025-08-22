import type { ComposerOptions, CompositionContext } from '../type/index.js'

export function constructor(this: any, options: ComposerOptions = {}) {
  this.options = {
    particlesPath: options.particlesPath || './particles',
    componentsPath: options.componentsPath || './components',
    documentsPath: options.documentsPath || './documents',
    outputPath: options.outputPath || './output',
    watch: options.watch || false,
    debounceMs: options.debounceMs || 1000,
    ...options
  }

  this.context = {
    particles: {},
    components: {},
    documents: {}
  } as CompositionContext

  this.watcher = null
}