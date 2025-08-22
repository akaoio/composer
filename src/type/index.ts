export interface Particle {
  name: string
  type: string
  category?: string
  strength?: number
  description?: string
  content: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface Component {
  name: string
  type?: string
  particles: ParticleReference[]
  compose?: {
    template: string
    [key: string]: any
  }
}

export interface ParticleReference {
  category: string
  name: string
  weight?: number
}

export interface Document {
  name: string
  description?: string
  template: string
  particles?: ParticleReference[]
  components?: string[]
  sections?: DocumentSection[]
}

export interface DocumentSection {
  title?: string
  template?: string
  particles?: ParticleReference[]
  components?: string[]
}

export interface ComposerOptions {
  particlesPath?: string
  componentsPath?: string
  documentsPath?: string
  outputPath?: string
  watch?: boolean
  debounceMs?: number
}

export interface CompositionContext {
  particles: Record<string, Record<string, Particle>>
  components: Record<string, Component>
  documents?: Record<string, Document>
}

export interface TemplateVariable {
  type: 'particle' | 'component' | 'custom'
  path: string[]
  original: string
}