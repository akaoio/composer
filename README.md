# @akaoio/composer

Atomic document composition engine with real-time template processing. Inspired by VentureOne's soul-particle architecture.

## Features

- **Atomic Composition**: Build documents from smallest possible units (particles)
- **Real-time Processing**: Watch files and recompose automatically  
- **Template Engine**: Powerful variable substitution with hierarchical resolution
- **TypeScript Support**: Full type safety with modern ES modules
- **Zero Dependencies**: Minimal footprint with only essential dependencies

## Installation

```bash
npm install @akaoio/composer
```

## Quick Start

### 1. Create Particles

```yaml
# particles/concept/introduction.yaml
name: introduction
type: concept
category: concept
content: |
  # Welcome to My Project
  
  This project demonstrates atomic composition...
```

### 2. Create Documents

```yaml
# documents/README.yaml
name: README
template: |
  {{particles.concept.introduction.content}}
  
  Generated at: {{custom.timestamp}}
```

### 3. Compose

```typescript
import { Composer } from '@akaoio/composer'

const composer = new Composer({
  particlesPath: './particles',
  documentsPath: './documents', 
  outputPath: './output'
})

// Add custom context
composer.context.custom = {
  timestamp: new Date().toISOString()
}

// Compose all documents
const outputs = await composer.compose()

// Watch for changes
composer.watch((newOutputs) => {
  console.log('Documents recomposed!')
})
```

## Architecture

### Hierarchical Composition

```
Particles → Components → Documents
    ↑           ↑            ↑
Atomic     Composed     Final Output
Units      Elements     Documents
```

### Template Variables

- `{{particles.category.name.field}}` - Reference particle content
- `{{components.name.template}}` - Reference component templates  
- `{{custom.path.to.value}}` - Reference custom context data

### Directory Structure

```
project/
├── particles/           # Atomic content units
│   ├── concept/        # Conceptual particles
│   ├── text/           # Text particles
│   └── technical/      # Technical particles
├── components/         # Composed elements
├── documents/          # Document definitions
└── output/            # Generated files
```

## API Reference

### Composer Class

```typescript
class Composer {
  constructor(options: ComposerOptions)
  
  async compose(): Promise<Map<string, string>>
  async loadParticles(): Promise<void>
  async loadComponents(): Promise<void>
  async loadDocuments(): Promise<void>
  
  watch(callback?: (outputs: Map<string, string>) => void): void
  stop(): void
}
```

### ComposerOptions

```typescript
interface ComposerOptions {
  particlesPath?: string      // Default: './particles'
  componentsPath?: string     // Default: './components' 
  documentsPath?: string      // Default: './documents'
  outputPath?: string         // Default: './output'
  watch?: boolean            // Default: false
  debounceMs?: number        // Default: 1000
}
```

### Particle Format

```yaml
name: string              # Required: Particle identifier
type: string              # Particle type
category?: string         # Organization category  
description?: string      # Description
content: string           # Main content
tags?: string[]          # Tags for organization
metadata?: object        # Additional metadata
```

## Examples

### Basic Usage

```typescript
const composer = new Composer()
const outputs = await composer.compose()

for (const [name, content] of outputs) {
  console.log(`Generated: ${name}`)
}
```

### With Custom Context

```typescript
composer.context.custom = {
  version: '1.0.0',
  author: 'Your Name',
  buildTime: Date.now()
}
```

### Real-time Watching

```typescript
composer.watch((outputs) => {
  console.log(`Recomposed ${outputs.size} documents`)
  
  // Custom processing
  outputs.forEach((content, name) => {
    // Send to external system, trigger webhooks, etc.
  })
})
```

### Complex Template

```yaml
template: |
  {{particles.text.title.content}}
  
  ## Overview
  {{particles.concept.introduction.content}}
  
  ## Technical Details
  {{components.technical-section.template}}
  
  ---
  Generated: {{custom.buildTime}}
  Version: {{custom.version}}
```

## Patterns & Best Practices

### 1. Atomic Particles
- Keep particles focused on single concepts
- Use descriptive names and categories
- Include metadata for organization

### 2. Reusable Components  
- Compose complex structures from particles
- Create templates for common patterns
- Document component interfaces

### 3. Template Organization
- Use consistent variable naming
- Group related variables
- Provide fallbacks for missing data

### 4. File Organization
- Mirror particle hierarchy in directories
- Use clear category names
- Separate concerns (text, concept, technical)

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { 
  Composer, 
  Template,
  type Particle,
  type Component, 
  type Document,
  type ComposerOptions 
} from '@akaoio/composer'
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality  
4. Ensure all tests pass
5. Submit pull request

## License

MIT © AKAO.IO