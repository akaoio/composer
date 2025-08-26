import { constructor } from './constructor.js'
import { render } from './render.js'
import { config as renderWithConfig } from './render/with/config.js'
import { watch } from './watch.js'
import { stop } from './stop.js'
import type { RenderContext } from '../type/index.js'

export interface ComposerOptions {
  configPath?: string
  dataPath?: string
  templatesPath?: string
  outputPath?: string
  watch?: boolean
  debounceMs?: number
  verbose?: boolean
}

export class Composer {
  options!: ComposerOptions
  context!: RenderContext
  watcher: any = null

  constructor(options: ComposerOptions = {}) {
    constructor.call(this, options)
  }

  async build(): Promise<Map<string, string>> {
    return renderWithConfig.call(this, this.options.configPath)
  }

  async render(template: string, data: any): Promise<string> {
    return render.call(this, template, data)
  }

  watch(callback?: (outputs: Map<string, string>) => void): void {
    return watch.call(this, callback)
  }

  stop(): void {
    return stop.call(this)
  }
}

export default Composer