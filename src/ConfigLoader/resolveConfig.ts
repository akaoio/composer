import path from 'path'
import type { ComposerConfig } from '../type/config.js'

export function resolveConfig(this: any, config: Partial<ComposerConfig>, baseDir?: string): ComposerConfig {
  const resolveDir = baseDir || process.cwd()
  return {
    sources: config.sources || {
      data: {
        pattern: 'data/**/*.{yaml,yml,json}',
        parser: 'yaml'
      }
    },
    
    build: {
      tasks: config.build?.tasks || [],
      parallel: config.build?.parallel ?? false,
      bail: config.build?.bail ?? true
    },
    
    outputs: config.outputs || [
      {
        target: 'output/README.md',
        template: 'templates/readme.md',
        format: 'markdown',
        processor: 'default'
      }
    ],
    
    plugins: config.plugins || [],
    
    watch: config.watch || {
      patterns: ['data/**/*', 'templates/**/*'],
      ignore: ['node_modules/**', 'output/**', 'dist/**'],
      debounce: 1000
    },
    
    options: {
      ...config.options,
      baseDir: config.options?.baseDir ? 
        (path.isAbsolute(config.options.baseDir) ? 
          config.options.baseDir : 
          path.resolve(resolveDir, config.options.baseDir)
        ) : resolveDir,
      cacheDir: config.options?.cacheDir || 'tmp',
      verbose: config.options?.verbose || false
    }
  }
}