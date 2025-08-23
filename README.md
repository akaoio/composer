# @akaoio/composer

> A powerful, atomic documentation engine that builds comprehensive docs from small reusable content pieces. Self-documenting and production-ready for Node.js, Bun, Deno, and standalone server deployment.

## ✨ Features


### 📝 Advanced Templating

Supports nested loops, conditionals, variable substitution, and complex data transformations.


### ⚡ Real-time Building

Watch mode with hot reload, file change detection, and incremental builds.


### 🚀 Multi-Platform Support

Works seamlessly with Node.js, Bun, Deno. Deploy as module or standalone server.


### ⚛️ Atomic Documentation

Break down documentation into small, reusable YAML pieces that can be combined into comprehensive documents.



## 📦 Installation


### Install via NPM

```bash
npm install @akaoio/composer
```



### Install via Deno

```typescript
import { Composer } from "npm:@akaoio/composer@latest"
```



### Install via Bun

```bash
bun add @akaoio/composer
```




## 🚀 Usage


### Node.js Module Usage

```javascript
const { Composer, BuildPipeline, ConfigLoader } = require('@akaoio/composer')

// Option 1: Simple usage
const composer = new Composer({
  dataPath: './data',
  templatesPath: './templates', 
  outputPath: './dist'
})

await composer.render()

// Option 2: Configuration-based
const loader = new ConfigLoader('./composer.config.js')
const config = await loader.loadConfig()
const pipeline = new BuildPipeline(config)
await pipeline.execute()
```



### Deno Module Usage

```typescript
import { Composer, BuildPipeline } from "npm:@akaoio/composer@latest"

// Deno with permissions
const composer = new Composer({
  dataPath: './data',
  templatesPath: './templates',
  outputPath: './dist'
})

await composer.render()
```

**Run with permissions:**
```bash
deno run --allow-read --allow-write --allow-env your-script.ts
```



### Bun Module Usage

```typescript
import { Composer, BuildPipeline, ConfigLoader } from '@akaoio/composer'

// Bun with TypeScript support
const composer = new Composer({
  dataPath: './data',
  templatesPath: './templates',
  outputPath: './dist'
})

await composer.render()

// Hot reload with Bun watch
import { watch } from 'fs'

composer.watch((outputs) => {
  console.log(`Rebuilt ${outputs.size} files`)
})
```




## 🖥️ Server Deployment

### Quick Start Server

```bash
# Clone and setup
git clone https://github.com/akaoio/composer.git
cd composer
npm install
npm run build

# Run as daemon service
npm run service:pm2

# Or with systemd
sudo npm run service:install
```

### Docker Deployment

```bash
# Build image
docker build -f docker/Dockerfile.service -t composer-server .

# Run container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/output:/app/output \
  --name composer-server \
  composer-server
```

### Health Monitoring

```bash
# Check service status
curl http://localhost:3000/health

# View build logs
curl http://localhost:3000/api/logs

# Trigger rebuild
curl -X POST http://localhost:3000/api/build
```


## 🤝 Contributing


### Development Setup

### Clone and Setup

```bash
git clone https://github.com/akaoio/composer.git
cd composer

# Install dependencies
npm install     # or `bun install` or `deno install`

# Build TypeScript
npm run build

# Run tests
npm test

# Build documentation (using composer itself!)
npm run build:doc
```



### Development Principles

When contributing, follow these core principles:

1. **Class = Directory + Method-per-file** - Every class is a directory
2. **Atomic Documentation** - Each piece of content is a separate YAML file
3. **Test-Driven Development** - Write tests first, implementation second
4. **100% Real Implementation** - No mocks, stubs, or placeholder code
5. **Zero Technical Debt** - Complete every task fully before moving on
6. **Self-Documenting** - This README is generated using Composer itself!




## 📄 License

MIT

## 🔗 Links

- **Repository**: https://github.com/akaoio/composer
- **NPM Package**: https://www.npmjs.com/package/@akaoio/composer
- **Documentation**: Generated using Composer itself!

---

*Generated with ❤️ by @akaoio/composer v0.2.1*

*This README demonstrates atomic documentation - every section is composed from individual YAML files in `src/doc/readme/atom/`*