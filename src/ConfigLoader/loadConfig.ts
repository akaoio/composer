import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { ComposerConfig } from '../type/config.js'

export async function loadConfig(this: any, configPath?: string): Promise<ComposerConfig> {
  const targetPath = configPath || this.configPath
  
  if (this.config && !configPath) {
    return this.config
  }

  let config: Partial<ComposerConfig> = {}

  if (targetPath) {
    const exists = await fs.access(targetPath).then(() => true).catch(() => false)
    
    if (!exists) {
      // If no configPath is provided and default doesn't exist, use empty config (defaults)
      if (!configPath && !this.configPath) {
        config = {}
      } else {
        throw new Error(`Config file not found: ${targetPath}`)
      }
    } else {
      const ext = path.extname(targetPath).toLowerCase()
      const content = await fs.readFile(targetPath, 'utf-8')
      
      switch (ext) {
      case '.js':
      case '.mjs':
        // Dynamic import for ES modules
        try {
          const module = await import(path.resolve(targetPath))
          config = module.default || module
        } catch (err: any) {
          // Fallback to require for CommonJS modules or when dynamic import fails
          try {
            delete require.cache[path.resolve(targetPath)]
            const requireResult = require(path.resolve(targetPath))
            if (requireResult && typeof requireResult === 'object' && 'default' in requireResult) {
              config = (requireResult as any).default as Partial<ComposerConfig>
            } else {
              config = requireResult as Partial<ComposerConfig>
            }
          } catch (requireErr) {
            throw new Error(`Failed to load config file: ${targetPath}\n${err.message}`)
          }
        }
        break
        
      case '.json':
        config = JSON.parse(content)
        break
        
      case '.yaml':
      case '.yml':
        config = yaml.load(content) as Partial<ComposerConfig>
        break
        
      default:
        throw new Error(`Unsupported config file format: ${ext}`)
      }
    }
  }

  this.config = this.resolveConfig(config)
  this.validateConfig(this.config)
  
  return this.config
}