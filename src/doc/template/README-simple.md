# {{project.name}}

> {{project.description}}

{{introduction.content}}

## Features

- **Template Engine**: Built-in template engine with variable substitution supporting nested paths and array access.
- **Multi-Format Support**: Seamlessly works with YAML, JSON, Markdown, HTML, and plain text files.
- **Watch Mode**: Automatic rebuilding when source files change, perfect for development workflows.
- **Flexible Build Pipeline**: Configurable build tasks with custom processors for complex content transformations.

## Installation

```bash
npm install {{project.package}}
```

## Quick Start

```javascript
import { Composer } from '{{project.package}}'

const composer = new Composer({
  dataPath: './data',
  templatesPath: './templates',
  outputPath: './dist'
})

// Build your content
await composer.render()
```

## Documentation

This documentation is generated using Composer itself! Check out the `src/doc/` directory to see how it works.

## Architecture

{{architecture.description}}

### Core Components

- **Composer**: Main orchestrator class for the build process
- **BuildPipeline**: Manages build tasks and transformations
- **Template**: Template engine with variable substitution
- **ConfigLoader**: Loads and validates configuration files

## Example

Generate documentation from YAML and Markdown files:

```javascript
const config = {
  sources: {
    content: {
      pattern: 'content/**/*.md',
      parser: 'markdown'
    },
    data: {
      pattern: 'data/**/*.yaml',
      parser: 'yaml'
    }
  },
  outputs: [
    {
      target: 'dist/README.md',
      format: 'markdown'
    }
  ]
}
```

## API Reference

### Composer Class

Main class for orchestrating the build process.

**Methods:**
- `loadData()`: Loads data from configured data path
- `render()`: Renders templates with loaded data
- `watch(callback?)`: Watches for file changes and rebuilds
- `stop()`: Stops watching for changes

### BuildPipeline Class

Manages the build process with configurable tasks.

**Methods:**
- `execute()`: Executes all configured build tasks
- `loadSources()`: Loads source files based on patterns
- `processOutputs()`: Generates output files in configured formats

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

{{project.license}}

---

*Generated with ❤️ by {{project.name}} v{{project.version}}*