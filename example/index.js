#!/usr/bin/env node

/**
 * REAL Working Example for @akaoio/composer
 * This example actually works with the current codebase
 */

const { BuildPipeline } = require('../dist/index.js')
const { promises: fs } = require('fs')
const path = require('path')

async function realWorkingExample() {
  console.log('\n🚀 Real @akaoio/composer Example')
  console.log('=================================\n')
  
  // Create test data and templates
  const workDir = path.join(process.cwd(), 'tmp', 'real-example')
  await fs.mkdir(path.join(workDir, 'data'), { recursive: true })
  await fs.mkdir(path.join(workDir, 'templates'), { recursive: true })
  await fs.mkdir(path.join(workDir, 'output'), { recursive: true })
  
  // Create a YAML data file
  await fs.writeFile(
    path.join(workDir, 'data', 'project.yaml'),
    `name: "@akaoio/composer"
version: "0.2.3"
description: "Atomic documentation engine"
features:
  - name: "Template Processing"
    description: "Handlebars-compatible template engine"
  - name: "Multi-format Output"
    description: "Markdown, HTML, JSON, YAML, CSV, XML"
  - name: "Import Resolution"
    description: "Cross-file imports with $import syntax"
author:
  name: "AKAO Team"
  email: "team@akao.io"`
  )
  
  // Create another YAML file to test imports
  await fs.writeFile(
    path.join(workDir, 'data', 'meta.yaml'),
    `license: "MIT"
repository: "https://github.com/akaoio/composer"
keywords:
  - documentation
  - template
  - build`
  )
  
  // Create a file with $import
  await fs.writeFile(
    path.join(workDir, 'data', 'full-config.yaml'),
    `$import: ./project.yaml
meta:
  $import: ./meta.yaml
buildDate: "${new Date().toISOString()}"`
  )
  
  // Create a template
  await fs.writeFile(
    path.join(workDir, 'templates', 'readme.md'),
    `# {{projectData.name}} v{{projectData.version}}

{{projectData.description}}

## Features
{{#each projectData.features}}
### {{name}}
{{description}}
{{/each}}

## Author
- **Name**: {{projectData.author.name}}
- **Email**: {{projectData.author.email}}

## Full Configuration Test
Project: {{fullConfig.name}}
License: {{fullConfig.meta.license}}
Repository: {{fullConfig.meta.repository}}
Build Date: {{fullConfig.buildDate}}

---
Generated with @akaoio/composer`
  )
  
  // Create composer configuration
  const config = {
    sources: {
      projectData: {
        pattern: path.join(workDir, 'data', 'project.yaml'),
        parser: 'yaml'
      },
      fullConfig: {
        pattern: path.join(workDir, 'data', 'full-config.yaml'),
        parser: 'yaml'
      }
    },
    build: {
      tasks: [] // No build tasks needed for simple example
    },
    outputs: [
      {
        target: path.join(workDir, 'output', 'README.md'),
        template: path.join(workDir, 'templates', 'readme.md'),
        format: 'markdown'
      },
      {
        target: path.join(workDir, 'output', 'README.html'),
        template: path.join(workDir, 'templates', 'readme.md'),
        format: 'html'
      },
      {
        target: path.join(workDir, 'output', 'data.json'),
        template: path.join(workDir, 'templates', 'readme.md'),
        format: 'json'
      }
    ]
  }
  
  // Run the build pipeline
  console.log('📦 Building with composer...')
  const pipeline = new BuildPipeline(config)
  const outputs = await pipeline.execute()
  
  console.log(`\n✅ Generated ${outputs.size} files:\n`)
  
  // Display outputs
  for (const [filename, content] of outputs) {
    const fullPath = path.join(workDir, 'output', filename)
    console.log(`📄 ${filename} (${content.length} bytes)`)
    
    // Show preview of each file
    if (filename.endsWith('.md')) {
      console.log('   Preview:')
      console.log('   ' + content.substring(0, 150).replace(/\n/g, '\n   ') + '...\n')
    } else if (filename.endsWith('.html')) {
      // Check if HTML conversion worked
      const hasHtmlTags = content.includes('<h1>') && content.includes('</h1>')
      console.log(`   HTML tags present: ${hasHtmlTags ? '✅' : '❌'}\n`)
    } else if (filename.endsWith('.json')) {
      try {
        const parsed = JSON.parse(content)
        console.log(`   Valid JSON: ✅ (${Object.keys(parsed).length} keys)\n`)
      } catch {
        console.log('   Valid JSON: ❌\n')
      }
    }
  }
  
  // Test data transformation
  console.log('🔄 Testing data transformation...')
  const transformConfig = {
    sources: {
      transformedData: {
        pattern: path.join(workDir, 'data', 'project.yaml'),
        parser: 'yaml',
        transform: (data, meta) => {
          return {
            ...data,
            upperName: data.name.toUpperCase(),
            featureCount: data.features.length,
            metadata: meta
          }
        }
      }
    },
    build: {
      tasks: []
    },
    outputs: []
  }
  
  const transformPipeline = new BuildPipeline(transformConfig)
  await transformPipeline.loadSources()
  
  const transformed = transformPipeline.context.sources.transformedData
  console.log('✅ Transform applied:')
  console.log(`   upperName: ${transformed.upperName}`)
  console.log(`   featureCount: ${transformed.featureCount}`)
  console.log(`   metadata.path: ${transformed.metadata.path}`)
  
  console.log('\n🎉 Example completed successfully!')
  console.log(`📁 Output files saved to: ${workDir}/output/`)
  
  return workDir
}

// Test custom processors
async function testCustomProcessors() {
  console.log('\n🔧 Testing Custom Processors')
  console.log('============================\n')
  
  const workDir = path.join(process.cwd(), 'tmp', 'processor-example')
  await fs.mkdir(workDir, { recursive: true })
  
  // Create test data
  await fs.writeFile(
    path.join(workDir, 'data.json'),
    JSON.stringify([
      { name: 'Item 1', value: 10 },
      { name: 'Item 2', value: 20 },
      { name: 'Item 3', value: 30 }
    ])
  )
  
  const config = {
    sources: {
      items: {
        pattern: path.join(workDir, 'data.json'),
        parser: 'json'
      }
    },
    build: {
      tasks: [
        {
          name: 'transform-items',
          input: 'items',
          processor: 'data-transformer',
          options: {
            map: (item) => ({
              ...item,
              doubled: item.value * 2
            }),
            filter: (item) => item.value >= 20
          }
        }
      ]
    },
    outputs: []
  }
  
  const pipeline = new BuildPipeline(config)
  await pipeline.execute()
  
  const result = pipeline.context.variables['transform-items']
  console.log('✅ Data transformation result:')
  console.log(JSON.stringify(result, null, 2))
  
  console.log('\n✅ Custom processors work!')
}

// Run if called directly
if (require.main === module) {
  (async () => {
    try {
      await realWorkingExample()
      await testCustomProcessors()
    } catch (error) {
      console.error('❌ Example failed:', error)
      console.error(error.stack)
      process.exit(1)
    }
  })()
}

module.exports = { realWorkingExample, testCustomProcessors }