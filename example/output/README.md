# Atomic Composer Demo

# Welcome to Atomic Composer

This is a demonstration of atomic document composition where content is built 
from the smallest possible units (particles) and assembled into complete documents.

Features:
- Real-time composition
- Template variable substitution
- Hierarchical particle organization
- File system watching


## Generated Information

This document was composed from particles on 2025-08-22T10:54:26.232Z.

## Usage

```typescript
import { Composer } from '@akaoio/composer'

const composer = new Composer({
  particlesPath: './particles',
  documentsPath: './documents',
  outputPath: './output'
})

const outputs = await composer.compose()
```
