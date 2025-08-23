#!/usr/bin/env node

/**
 * Extract metadata từ source code để generate documentation
 */

const fs = require('fs').promises
const path = require('path')
const { glob } = require('glob')

async function extractMetadata() {
  const metadata = {
    // From package.json
    package: JSON.parse(await fs.readFile('package.json', 'utf-8')),
    
    // Classes từ src/
    classes: [],
    
    // Methods count
    totalMethods: 0,
    
    // Features từ examples
    examples: [],
    
    // Template features được support
    templateFeatures: [
      '{{variable}} - Variable substitution',
      '{{#each array}} - Loop through arrays',
      '{{#if condition}} - Conditional rendering',
      '{{else}} - Else clause for conditionals', 
      '{{@index}}, {{@first}}, {{@last}} - Loop variables',
      '{{this}} - Current item in loop'
    ],
    
    // Import features
    importFeatures: [
      'YAML imports with import: directive',
      'JSON imports with import: directive',
      'Nested imports (unlimited depth)',
      'Circular import detection',
      'Import caching for performance'
    ]
  }

  // Extract classes từ src/
  const classDirs = await glob('src/*/index.ts')
  for (const classFile of classDirs) {
    const className = path.basename(path.dirname(classFile))
    const methods = await glob(`src/${className}/*.ts`)
    const methodNames = methods
      .map(m => path.basename(m, '.ts'))
      .filter(m => m !== 'index' && m !== 'constructor')
    
    metadata.classes.push({
      name: className,
      methods: methodNames,
      methodCount: methodNames.length
    })
    metadata.totalMethods += methodNames.length
  }

  // Extract examples
  const exampleDirs = await glob('examples/*/', { })
  for (const exampleDir of exampleDirs) {
    const exampleName = path.basename(exampleDir)
    const configs = await glob(`${exampleDir}/*.js`)
    
    metadata.examples.push({
      name: exampleName,
      configs: configs.map(c => path.basename(c)),
      hasData: await fs.access(`${exampleDir}/data`).then(() => true).catch(() => false),
      hasTemplates: await fs.access(`${exampleDir}/templates`).then(() => true).catch(() => false)
    })
  }

  // Extract supported formats
  const formatMethods = await glob('src/BuildPipeline/formatAs*.ts')
  metadata.supportedFormats = formatMethods
    .map(f => path.basename(f, '.ts').replace('formatAs', '').toLowerCase())

  // Write to file
  await fs.writeFile(
    'src/doc/metadata.json',
    JSON.stringify(metadata, null, 2)
  )
  
  console.log('✅ Extracted metadata to src/doc/metadata.json')
  return metadata
}

if (require.main === module) {
  extractMetadata()
}

module.exports = { extractMetadata }