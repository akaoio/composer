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
    const candidates = [
      'composer.config.js',
      'composer.config.mjs', 
      'composer.config.yaml',
      'composer.config.yml',
      'composer.config.json'
    ]
    
    // In a real implementation, we'd check file system
    // For now, return the first candidate
    return candidates[0]
  }
}

export default ConfigLoader