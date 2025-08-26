# @akaoio/composer

> Atomic document composition engine with real-time template processing

## ✨ Features

### 🧩 Atomic Documentation
Compose documentation from small, reusable YAML atoms that can be combined into comprehensive documents.

### 🔄 Real-time Processing
Watch mode automatically regenerates documentation when source files change.

### 📝 Template Engine
Handlebars-compatible template processing with variable substitution and loops.

### 🏗️ Build Pipeline
Configurable build pipeline that loads data sources, processes templates, and generates outputs.

### 📁 Multiple Formats
Generate Markdown, HTML, JSON, and other text-based formats from the same source data.

## 📦 Installation

### NPM Installation
```bash
npm install @akaoio/composer
```

### Global Installation
```bash
npm install -g @akaoio/composer
```

### Development Installation
```bash
git clone https://github.com/akaoio/composer.git
cd composer
npm install
npm run build
```

## 🚀 Usage

### Basic Usage
```javascript
const { BuildPipeline } = require('@akaoio/composer')

const config = {
  sources: {
    data: {
      pattern: 'src/data.yaml',
      parser: 'yaml'
    }
  },
  outputs: [
    {
      target: 'output/README.md',
      template: 'templates/readme.md',
      format: 'markdown'
    }
  ]
}

const pipeline = new BuildPipeline(config)
const results = await pipeline.execute()
console.log('Generated:', results)
```

### Configuration File
Create `composer.config.cjs`:
```javascript
module.exports = {
  sources: {
    // Define your data sources
    info: { pattern: 'src/doc/info.yaml', parser: 'yaml' },
    features: { pattern: 'src/doc/features.yaml', parser: 'yaml' }
  },
  outputs: [
    // Define your outputs
    {
      target: 'README.md',
      template: 'templates/readme.md',
      format: 'markdown'
    }
  ]
}
```

### Template Syntax
Templates use Handlebars-compatible syntax:
```handlebars
# {{title}}

{{description}}

## Features
{{#each features}}
- **{{name}}**: {{description}}
{{/each}}
```

### CLI Usage
```bash
# Build with config file
composer

# Watch mode
composer --watch

# Custom config
composer --config custom.config.cjs
```

## 🖥️ Server Deployment

### PM2 Deployment
```bash
npm run service:pm2
```

### Docker Deployment
```bash
npm run service:docker
```

### Systemd Service
```bash
npm run service:install
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/composer.git`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Run tests: `npm test`

### Testing
- Run all tests: `npm test`
- Watch mode: `npm run test:watch`
- Build and test: `npm run test:full`

### Code Style
- Follow the Class = Directory pattern
- One method per file
- 100% real implementation (no mocks/stubs)
- Write tests before implementation

## 📄 License

MIT

## 🔗 Links

- **Repository**: https://github.com/akaoio/composer
- **NPM Package**: https://www.npmjs.com/package/@akaoio/composer
- **Documentation**: Generated using Composer itself!

---

*Generated with ❤️ by @akaoio/composer v0.2.4*

*This README demonstrates atomic documentation - every section is composed from individual YAML files in `src/doc/readme/atom/`*