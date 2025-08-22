# {{project.name}}

> {{project.description}}

{{introduction.content}}

## Features

{{#each features}}
- **{{title}}**: {{content}}
{{/each}}

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

{{#each architecture.components}}
- **{{name}}**: {{description}}
{{/each}}

## Examples

{{#each examples}}
### {{title}}

{{content}}

```javascript
{{code}}
```

{{/each}}

## API Reference

{{#each api.classes}}
### {{name}}

{{description}}

#### Methods

{{#each methods}}
- `{{name}}({{params}})`: {{description}}
{{/each}}

{{/each}}

## Service Deployment

{{#each services}}
### {{title}}

{{content}}

{{#if details}}
**Commands:**
{{#each details}}
- **{{@key}}**: `{{this}}`
{{/each}}
{{/if}}

{{/each}}

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

{{project.license}}

---

*Generated with ❤️ by {{project.name}} v{{project.version}}*