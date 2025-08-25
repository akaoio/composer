import { constructor } from './constructor.js'
import { loadConfig } from './loadConfig.js'
import { resolveConfig } from './resolveConfig.js'
import { validateConfig } from './validateConfig.js'
import type { ComposerConfig } from '../type/config.js'

export class ConfigLoader {
  configPath?: string
  config?: ComposerConfig

  constructor(configPath?: string) {
    constructor.call(this, configPath)
  }

  async loadConfig(configPath?: string): Promise<ComposerConfig> {
    return loadConfig.call(this, configPath)
  }

  resolveConfig(config: Partial<ComposerConfig>, baseDir?: string): ComposerConfig {
    return resolveConfig.call(this, config, baseDir)
  }

  validateConfig(config: ComposerConfig): void {
    return validateConfig.call(this, config)
  }

  findConfigFile(): string | undefined {
    const fs = require('fs')
    const path = require('path')
    
    const candidates = [
      'composer.config.js',
      'composer.config.mjs', 
      'composer.config.yaml',
      'composer.config.yml',
      'composer.config.json'
    ]
    
    for (const candidate of candidates) {
      const fullPath = path.resolve(process.cwd(), candidate)
      if (fs.existsSync(fullPath)) {
        return candidate
      }
    }
    
    return undefined
  }
}

export default ConfigLoader