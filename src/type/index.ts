// Generic data structure - no opinions about content
export interface DataItem {
  [key: string]: any
}

// Generic collection of data items
export interface DataCollection {
  [key: string]: DataItem | DataItem[]
}

// Generic template variable - no domain-specific types
export interface TemplateVariable {
  path: string[]
  original: string
  value?: any
}

// Generic context for template rendering
export interface RenderContext {
  data: Record<string, any>
  variables?: Record<string, any>
  functions?: Record<string, Function>
}

export interface ImportConfig {
  source: string
  alias?: string
  select?: string
  type?: 'inline' | 'frontmatter' | 'block'
}

export interface ImportResult {
  source: string
  data: any
  alias?: string
}

export interface ImportContext {
  loadedFiles: Map<string, any>
  importChain: string[]
  baseDir: string
}