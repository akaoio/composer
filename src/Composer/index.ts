import { constructor } from './constructor.js'
import { data as loadData } from './load/data.js'
import { render } from './render.js'
import { config as renderWithConfig } from './render/with/config.js'
import { processor as registerProcessor } from './register/processor.js'
import { watch } from './watch.js'
import { stop } from './stop.js'
import type { RenderContext } from '../type/index.js'
import type { Processor } from '../type/config.js'

export interface ComposerOptions {
  dataPath?: string
  templatesPath?: string
  outputPath?: string
  watch?: boolean
  debounceMs?: number
}

export class Composer {
  options!: ComposerOptions
  context!: RenderContext
  watcher: any = null
  customProcessors?: Processor[]

  constructor(options: ComposerOptions = {}) {
    constructor.call(this, options)
  }

  async loadData(): Promise<void> {
    return loadData.call(this)
  }

  async render(): Promise<Map<string, string>> {
    return render.call(this)
  }

  async renderWithConfig(configPath?: string): Promise<Map<string, string>> {
    return renderWithConfig.call(this, configPath)
  }

  registerProcessor(processor: Processor): void {
    return registerProcessor.call(this, processor)
  }

  watch(callback?: (outputs: Map<string, string>) => void): void {
    return watch.call(this, callback)
  }

  stop(): void {
    return stop.call(this)
  }
}

export default Composer