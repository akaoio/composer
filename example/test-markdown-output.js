#!/usr/bin/env node

const { Composer } = require('../dist/index.js')
const fs = require('fs/promises')
const path = require('path')

async function testMarkdownOutput() {
  console.log('🚀 Testing Composer Markdown Output...\n')
  
  // Create temp directories
  const tempDir = path.join(process.cwd(), 'tmp', 'md-test')
  const outputDir = path.join(tempDir, 'output')
  
  await fs.mkdir(path.join(tempDir, 'content'), { recursive: true })
  await fs.mkdir(path.join(tempDir, 'data'), { recursive: true })
  await fs.mkdir(outputDir, { recursive: true })
  
  // Create sample content
  await fs.writeFile(
    path.join(tempDir, 'content', 'intro.md'),
    `# Introduction

This is the introduction section with **bold** and *italic* text.

## Features
- Feature 1
- Feature 2
- Feature 3`
  )
  
  await fs.writeFile(
    path.join(tempDir, 'data', 'metadata.json'),
    JSON.stringify({
      title: 'Composer Documentation',
      version: '1.0.0',
      author: 'AKAO Team',
      date: new Date().toISOString()
    }, null, 2)
  )
  
  // Create template
  await fs.writeFile(
    path.join(tempDir, 'template.md'),
    `# {{metadata.title}}

**Version**: {{metadata.version}}  
**Author**: {{metadata.author}}  
**Generated**: {{metadata.date}}

---

{{intro.content}}

---

## Additional Information

This document was generated using the Composer build system.

### Technical Details
- Built with TypeScript
- Supports multiple output formats
- Template-based generation`
  )
  
  // Create config
  const config = {
    sources: {
      content: {
        pattern: 'content/**/*.md',
        parser: 'markdown'
      },
      data: {
        pattern: 'data/**/*.json',
        parser: 'json'
      }
    },
    
    build: {
      tasks: []
    },
    
    outputs: [
      {
        target: 'output/README.md',
        format: 'markdown'
      },
      {
        target: 'output/documentation.md',
        format: 'markdown'
      }
    ],
    
    options: {
      baseDir: tempDir
    }
  }
  
  // Save config
  await fs.writeFile(
    path.join(tempDir, 'composer.config.js'),
    `export default ${JSON.stringify(config, null, 2)}`
  )
  
  try {
    // Initialize Composer
    const composer = new Composer({
      dataPath: path.join(tempDir, 'data'),
      templatesPath: path.join(tempDir),
      outputPath: outputDir
    })
    
    // Load data
    await composer.loadData()
    console.log('📊 Loaded context:', composer.context)
    
    // Render with template
    const outputs = await composer.render()
    console.log('\n📝 Generated outputs:', outputs.size, 'files')
    
    // Check generated files
    const files = await fs.readdir(outputDir)
    console.log('\n📁 Output files:', files)
    
    // Read and display generated markdown
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(outputDir, file), 'utf-8')
        console.log(`\n📄 Content of ${file}:`)
        console.log('---')
        console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''))
        console.log('---')
      }
    }
    
    console.log('\n✅ Markdown output test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run test
testMarkdownOutput().catch(console.error)