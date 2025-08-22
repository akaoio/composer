# {{project.name}}

![Version](https://img.shields.io/badge/version-{{project.version}}-blue)
![License](https://img.shields.io/badge/license-{{project.license}}-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

> {{project.description}}

## 🌟 Overview

{{introduction.summary}}

### ✨ Key Highlights

{{#list introduction.highlights}}

### 🤖 Self-Documenting

{{introduction.selfDocumenting}}

## 📋 Table of Contents

{{#each toc}}
- [{{title}}](#{{slug}})
{{#each items}}  - [{{title}}](#{{slug}})
{{/each}}
{{/each}}

## 🚀 Features

{{#each features}}
### {{icon}} {{name}}

{{description}}

{{#if benefits}}
**Benefits:**
{{#list benefits}}
{{/if}}

{{#if examples}}
**Examples:**
{{#each examples}}
```{{language}}
{{code}}
```
{{/each}}
{{/if}}

{{/each}}

## 📦 Installation

### NPM
```bash
{{installation.npm}}
```

### Yarn
```bash
{{installation.yarn}}
```

### Requirements
{{#list installation.requirements}}

## ⚡ Quick Start

### Basic Usage

```javascript
{{quickStart.import}}

{{quickStart.basic}}
```

### Advanced Configuration

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
  
  build: {
    tasks: [
      {
        name: 'process-content',
        input: 'content',
        processor: 'markdown-processor'
      }
    ]
  },
  
  outputs: [
    {
      target: 'dist/README.md',
      format: 'markdown'
    }
  ]
}

const composer = new Composer(config)
await composer.render()
```

## 🏗️ Architecture

{{architecture.description}}

### Core Components

{{#each architecture.components}}
- **{{name}}**: {{description}}
{{/each}}

### Class Structure

This project follows the **Class = Directory + Method-per-file** pattern:

```
ClassName/
  index.ts         # Class definition (container only)
  constructor.ts   # Constructor implementation  
  methodName.ts    # Individual method files
  methodName.test.ts # Method tests
```

## 📖 Examples

{{#each examples}}
### {{title}}

{{description}}

```{{language}}
{{code}}
```

{{/each}}

## 🔧 API Reference

{{#each api.classes}}
### {{name}}

{{description}}

#### Methods

{{#each methods}}
##### `{{name}}({{params}})`

{{description}}

{{#if returns}}
**Returns:** {{returns}}
{{/if}}

{{#each examples}}
```javascript
{{this}}
```
{{/each}}

{{/each}}

{{/each}}

## 🧪 Testing

This project uses **Test-Driven Development (TDD)**:

1. Write test first (Red phase)
2. Write minimal code to pass (Green phase) 
3. Refactor while keeping tests green

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🤝 Contributing

We welcome contributions! Please follow our development principles:

1. **Class = Directory pattern** - Each class is a directory
2. **One method per file** - Methods in separate files
3. **Test-driven development** - Write tests first
4. **Zero technical debt** - Complete tasks fully
5. **Clean workspace** - Keep tmp/ for temporary files

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Write tests first (TDD)
4. Implement feature following our patterns
5. Ensure all tests pass: `npm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open Pull Request

## 📝 License

{{project.license}}

## 🙏 Acknowledgments

- Built with TypeScript and modern Node.js
- Follows AKAO.io development principles
- Uses Test-Driven Development methodology

---

**This documentation is generated using {{project.name}} itself!** 

Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.

*Generated with ❤️ by {{project.name}} v{{project.version}}*