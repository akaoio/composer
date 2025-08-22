export interface SourceConfig {
  pattern: string | string[]
  exclude?: string[]
  parser?: 'yaml' | 'json' | 'markdown' | 'handlebars' | string
  namespace?: string
  transform?: (content: any, file: { path: string; name: string }) => any
}

export interface TaskConfig {
  name: string
  input: string | string[]
  processor: string
  output?: string | string[]
  options?: Record<string, any>
  condition?: (context: any) => boolean
}

export interface OutputConfig {
  target: string | string[] | {
    pattern: string
    forEach?: string
    contentTemplate?: string
  }
  format: 'markdown' | 'json' | 'html' | 'yaml' | string
  processor: string
  template?: string
  options?: Record<string, any>
}

export interface WatchConfig {
  patterns: string[]
  ignore?: string[]
  debounce?: number
  reload?: boolean
}

export interface ComposerConfig {
  // Source definitions
  sources: Record<string, SourceConfig>
  
  // Build pipeline
  build: {
    tasks: TaskConfig[]
    parallel?: boolean
    bail?: boolean
  }
  
  // Output targets
  outputs: OutputConfig[]
  
  // Plugin system
  plugins?: string[]
  
  // Watch configuration
  watch?: WatchConfig
  
  // Global options
  options?: {
    baseDir?: string
    cacheDir?: string
    verbose?: boolean
    [key: string]: any
  }
}

export interface BuildContext {
  sources: Record<string, any>
  data: Record<string, any>
  variables: Record<string, any>
  files: Map<string, any>
  config: ComposerConfig
}

export interface Processor {
  name: string
  process: (input: any, options: any, context: BuildContext) => Promise<any>
}

export interface Plugin {
  name: string
  setup?: (config: ComposerConfig) => void
  processors?: Processor[]
  hooks?: {
    beforeBuild?: (context: BuildContext) => Promise<void>
    afterBuild?: (context: BuildContext, outputs: Map<string, string>) => Promise<void>
    [key: string]: any
  }
}