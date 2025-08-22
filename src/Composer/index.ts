import { constructor } from './constructor.js'
import { loadParticles } from './loadParticles.js'
import { loadComponents } from './loadComponents.js'
import { loadDocuments } from './loadDocuments.js'
import { compose } from './compose.js'
import { composeDocument } from './composeDocument.js'
import { watch } from './watch.js'
import { stop } from './stop.js'
import type { ComposerOptions, CompositionContext } from '../type/index.js'

export class Composer {
  options!: ComposerOptions
  context!: CompositionContext
  watcher: any = null

  constructor(options: ComposerOptions = {}) {
    constructor.call(this, options)
  }

  async loadParticles(): Promise<void> {
    return loadParticles.call(this)
  }

  async loadComponents(): Promise<void> {
    return loadComponents.call(this)
  }

  async loadDocuments(): Promise<void> {
    return loadDocuments.call(this)
  }

  async compose(): Promise<Map<string, string>> {
    return compose.call(this)
  }

  async composeDocument(document: any): Promise<string> {
    return composeDocument.call(this, document)
  }

  watch(callback?: (outputs: Map<string, string>) => void): void {
    return watch.call(this, callback)
  }

  stop(): void {
    return stop.call(this)
  }
}

export default Composer