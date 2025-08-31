#!/usr/bin/env node

/**
 * Build documentation for composer using composer itself
 * This script:
 * 1. Builds composer
 * 2. Uses composer to generate its own documentation
 */

import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function buildDocs() {
  console.log('📦 Building composer...')
  execSync('npm run build', { stdio: 'inherit' })
  
  console.log('\n📝 Generating documentation using composer...')
  
  // Load the built composer
  const { ConfigLoader, BuildPipeline } = await import('../dist/index.js')
  
  // Use the simple config for now
  let configPath = path.join(__dirname, '..', 'composer.simple.config.cjs')
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ Documentation config not found:', configPath)
    console.log('Creating documentation config...')
    
    // Create a documentation config that uses composer itself
    const docConfig = `module.exports = {
  sources: {
    // Load TypeScript source files
    sourceCode: {
      pattern: 'src/**/*.ts',
      parser: 'typescript',
      transform: (content, file) => {
        // Extract class, method, and documentation info
        const className = file.path.split('/').slice(-2, -1)[0]
        const methodName = path.basename(file.name, '.ts')
        
        // Extract JSDoc comments
        const jsdocMatch = content.match(/\\/\\*\\*([\\s\\S]*?)\\*\\//g)
        const docs = jsdocMatch ? jsdocMatch[0] : ''
        
        return {
          className,
          methodName,
          filePath: file.path,
          documentation: docs,
          content: content
        }
      }
    },
    
    // Load package.json for metadata
    packageInfo: {
      pattern: 'package.json',
      parser: 'json'
    },
    
    // Load examples
    examples: {
      pattern: 'examples/*/config.js',
      parser: 'javascript',
      transform: (content, file) => {
        const exampleName = file.path.split('/').slice(-2, -1)[0]
        return {
          name: exampleName,
          path: file.path,
          config: content
        }
      }
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: 'README.md',
      template: 'templates/README.md.template',
      format: 'markdown'
    },
    {
      target: 'CLAUDE.md',
      template: 'templates/CLAUDE.md.template',
      format: 'markdown'
    },
    {
      target: 'docs/api.md',
      template: 'templates/api.md.template',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.',
    verbose: true
  }
}
`
    
    fs.writeFileSync(configPath, docConfig)
    console.log('✅ Created composer.simple.config.cjs')
  }
  
  // Load and execute the config
  const loader = new ConfigLoader(configPath)
  const config = await loader.loadConfig()
  
  const pipeline = new BuildPipeline(config)
  const outputs = await pipeline.execute()
  
  console.log('\n✅ Documentation generated:')
  for (const [file, content] of outputs) {
    console.log(`  - ${file} (${content.length} bytes)`)
  }
}

// Run the build
buildDocs().catch(error => {
  console.error('❌ Error building docs:', error)
  process.exit(1)
})