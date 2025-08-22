import path from 'path'
import type { ComposerConfig } from '../type/config.js'

export function resolveConfig(this: any, config: Partial<ComposerConfig>, baseDir?: string): ComposerConfig {
  const resolveDir = baseDir || process.cwd()
  return {
    sources: config.sources || {
      particles: {
        pattern: 'particles/**/*.{yaml,yml}',
        parser: 'yaml'
      },
      components: {
        pattern: 'components/**/*.{yaml,yml}',
        parser: 'yaml'
      },
      documents: {
        pattern: 'documents/**/*.{yaml,yml}',
        parser: 'yaml'
      }
    },
    
    build: {
      tasks: config.build?.tasks || [
        {
          name: 'load-particles',
          input: 'particles',
          processor: 'particle-loader'
        },
        {
          name: 'load-components',
          input: 'components', 
          processor: 'component-loader'
        },
        {
          name: 'compose-documents',
          input: ['particles', 'components', 'documents'],
          processor: 'document-composer'
        }
      ],
      parallel: config.build?.parallel ?? false,
      bail: config.build?.bail ?? true
    },
    
    outputs: config.outputs || [
      {
        target: 'output/**/*.md',
        format: 'markdown',
        processor: 'markdown-renderer'
      }
    ],
    
    plugins: config.plugins || [],
    
    watch: config.watch || {
      patterns: ['particles/**/*', 'components/**/*', 'documents/**/*'],
      ignore: ['node_modules/**', 'output/**'],
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