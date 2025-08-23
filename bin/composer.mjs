#!/usr/bin/env node

import { readFile } from 'fs/promises'
import path, { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { BuildPipeline } = require('../dist/index.js')

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get version from package.json
async function getVersion() {
  try {
    const packagePath = join(__dirname, '..', 'package.json')
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'))
    return packageJson.version
  } catch (error) {
    return 'unknown'
  }
}

// Show help information
function showHelp() {
  console.log(`
@akaoio/composer - Atomic document composition engine

USAGE:
  composer [command] [options]

COMMANDS:
  build [config]     Build documentation from config file (default: composer.config.js)
  init               Initialize a new composer project
  watch [config]     Watch for changes and rebuild automatically
  version, -v, --version    Show version number
  help, -h, --help          Show this help message

OPTIONS:
  --config, -c <file>       Specify config file path
  --output, -o <dir>        Specify output directory
  --verbose                 Show detailed build information
  --silent                  Suppress all output except errors

EXAMPLES:
  composer build                           # Build with default config
  composer build --config custom.config.js # Build with custom config
  composer watch                           # Watch and rebuild on changes
  composer init                            # Initialize new project
  
For more information, visit: https://github.com/akaoio/composer
`)
}

// Initialize a new composer project
async function initProject() {
  const { writeFile, mkdir } = await import('fs/promises')
  
  console.log('🚀 Initializing composer project...')
  
  // Create directories
  await mkdir('src/doc', { recursive: true })
  await mkdir('templates', { recursive: true })
  
  // Create sample config
  const configContent = `// @akaoio/composer configuration
module.exports = {
  sources: {
    docs: {
      pattern: 'src/doc/**/*.yaml',
      parser: 'yaml'
    }
  },
  build: {
    tasks: []
  },
  outputs: [
    {
      target: 'README.md',
      template: 'templates/readme.md'
    }
  ],
  options: {
    baseDir: process.cwd()
  }
}
`
  
  // Create sample template
  const templateContent = `# {{title}}

{{description}}

## Features

{{#each features}}
- {{this}}
{{/each}}

## Installation

\`\`\`bash
npm install {{name}}
\`\`\`

## Usage

{{usage}}

Generated with ❤️ by @akaoio/composer
`

  // Create sample data
  const dataContent = `title: "My Project"
description: "A sample project using @akaoio/composer"
name: "@my/project"
usage: |
  import { MyProject } from '@my/project'
  
  const project = new MyProject()
  project.run()
features:
  - "Feature 1"
  - "Feature 2" 
  - "Feature 3"
`

  // Write files
  await writeFile('composer.config.js', configContent)
  await writeFile('templates/readme.md', templateContent)
  await writeFile('src/doc/project.yaml', dataContent)
  
  console.log('✅ Composer project initialized!')
  console.log('\nNext steps:')
  console.log('1. Edit src/doc/project.yaml with your project data')
  console.log('2. Customize templates/readme.md template')
  console.log('3. Run: composer build')
}

// Build documentation
async function buildDocs(configPath = 'composer.config.js', options = {}) {
  try {
    if (!options.silent) {
      console.log('🏗️ Building documentation...')
    }
    
    // Load config
    let config
    try {
      // Try absolute path first, then relative to current working directory
      const absolutePath = path.isAbsolute(configPath) 
        ? configPath 
        : join(process.cwd(), configPath)
      
      // Try CommonJS require first, then ES module import
      try {
        // Use require for .js files (CommonJS)
        delete require.cache[require.resolve(absolutePath)]
        config = require(absolutePath)
      } catch (requireError) {
        // Fallback to ES module import
        const configUrl = `file://${absolutePath}`
        const configModule = await import(configUrl)
        config = configModule.default
      }
    } catch (error) {
      console.error(`❌ Config file not found: ${configPath}`)
      console.log('💡 Run "composer init" to create a sample configuration')
      if (options.verbose) {
        console.error('Error details:', error.message)
      }
      process.exit(1)
    }
    
    // Build
    const pipeline = new BuildPipeline(config)
    const result = await pipeline.execute()
    
    if (!options.silent) {
      console.log(`✅ Build completed! Generated ${result.size} files.`)
      if (options.verbose) {
        for (const [filename, content] of result) {
          console.log(`  📄 ${filename} (${content.length} chars)`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    if (options.verbose) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Watch for changes
async function watchDocs(configPath = 'composer.config.js', options = {}) {
  const { watch } = await import('chokidar')
  
  console.log('👁️ Watching for changes...')
  console.log('Press Ctrl+C to stop')
  
  // Initial build
  await buildDocs(configPath, { ...options, silent: false })
  
  // Watch for changes
  const watcher = watch(['src/**/*', 'templates/**/*', configPath], {
    ignored: /node_modules/,
    persistent: true
  })
  
  let building = false
  
  watcher.on('change', async (path) => {
    if (building) return
    
    building = true
    console.log(`\n📝 File changed: ${path}`)
    await buildDocs(configPath, { ...options, silent: true })
    console.log('✅ Rebuild complete')
    building = false
  })
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watcher...')
    watcher.close()
    process.exit(0)
  })
}

// Parse command line arguments
function parseArgs(args) {
  const options = {
    config: 'composer.config.js',
    verbose: false,
    silent: false
  }
  
  const commands = []
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=')
      
      switch (key) {
        case 'config':
        case 'c':
          options.config = value || args[++i]
          break
        case 'output':
        case 'o':
          options.output = value || args[++i]
          break
        case 'verbose':
          options.verbose = true
          break
        case 'silent':
          options.silent = true
          break
        case 'version':
        case 'v':
          commands.push('version')
          break
        case 'help':
        case 'h':
          commands.push('help')
          break
      }
    } else if (arg.startsWith('-')) {
      const flags = arg.substring(1)
      for (const flag of flags) {
        switch (flag) {
          case 'c':
            options.config = args[++i]
            break
          case 'o':
            options.output = args[++i]
            break
          case 'v':
            commands.push('version')
            break
          case 'h':
            commands.push('help')
            break
        }
      }
    } else {
      commands.push(arg)
    }
  }
  
  return { commands, options }
}

// Main CLI function
async function main() {
  const args = process.argv.slice(2)
  const { commands, options } = parseArgs(args)
  
  if (commands.length === 0) {
    showHelp()
    return
  }
  
  const command = commands[0]
  
  switch (command) {
    case 'build':
      const configPath = commands[1] || options.config
      await buildDocs(configPath, options)
      break
      
    case 'init':
      await initProject()
      break
      
    case 'watch':
      const watchConfig = commands[1] || options.config
      await watchDocs(watchConfig, options)
      break
      
    case 'version':
      const version = await getVersion()
      console.log(`@akaoio/composer v${version}`)
      break
      
    case 'help':
      showHelp()
      break
      
    default:
      console.error(`❌ Unknown command: ${command}`)
      console.log('💡 Run "composer help" for usage information')
      process.exit(1)
  }
}

// Run CLI
main().catch(error => {
  console.error('❌ Unexpected error:', error.message)
  process.exit(1)
})