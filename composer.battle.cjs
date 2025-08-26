#!/usr/bin/env node

/**
 * Battle Tests for @akaoio/composer
 * Recovered from Battle logs analysis
 */

const { Battle } = require('@akaoio/battle')
const fs = require('fs')
const path = require('path')

async function testComposerHelp() {
  const battle = new Battle({
    name: 'composer-help-test',
    timeout: 10000
  })

  return await battle.run(async (b) => {
    console.log('🧪 Testing composer --help...')
    
    b.spawn('bun', ['bin/composer.mjs', '--help'], {
      cwd: process.cwd()
    })
    
    await b.expect('@akaoio/composer - Atomic document composition engine')
    await b.expect('USAGE:')
    await b.expect('COMMANDS:')
    await b.expect('build [config]')
    await b.expect('watch [config]')
    
    console.log('✅ Composer help test passed')
  })
}

async function testComposerVersion() {
  const battle = new Battle({
    name: 'composer-version-test',
    timeout: 10000
  })

  return await battle.run(async (b) => {
    console.log('🧪 Testing composer --version...')
    
    b.spawn('bun', ['bin/composer.mjs', '--version'], {
      cwd: process.cwd()
    })
    
    // Should return version number
    await b.wait(2000)
    const output = b.getOutput()
    
    if (!output.match(/\d+\.\d+\.\d+/)) {
      throw new Error('Version not found in output')
    }
    
    console.log('✅ Composer version test passed')
  })
}

async function testComposerBuild() {
  const battle = new Battle({
    name: 'composer-build-test',
    timeout: 30000
  })

  return await battle.run(async (b) => {
    console.log('🧪 Testing composer build...')
    
    // Create test fixture
    const testDir = path.join(process.cwd(), 'tmp', 'test-fixtures')
    await fs.promises.mkdir(testDir, { recursive: true })
    
    const configFile = path.join(testDir, 'composer.config.js')
    await fs.promises.writeFile(configFile, `
export default {
  sources: ['src/doc/**/*.yaml'],
  template: 'src/doc/template/test.md',
  outputs: [
    {
      file: 'tmp/test-output.md',
      format: 'markdown'
    }
  ]
}`)
    
    // Create test data
    const docDir = path.join(testDir, 'src', 'doc')
    await fs.promises.mkdir(docDir, { recursive: true })
    
    await fs.promises.writeFile(path.join(docDir, 'test.yaml'), `
title: Test Document
content: This is a test
`)
    
    await fs.promises.writeFile(path.join(docDir, 'template.md'), `
# {{title}}
{{content}}
`)
    
    b.spawn('bun', ['bin/composer.mjs', 'build', '--config', configFile], {
      cwd: process.cwd()
    })
    
    await b.expect('Build completed', 20000)
    
    console.log('✅ Composer build test passed')
  })
}

async function testComposerBuildVerbose() {
  const battle = new Battle({
    name: 'composer-build-verbose-test',
    timeout: 30000
  })

  return await battle.run(async (b) => {
    console.log('🧪 Testing composer build --verbose...')
    
    const testConfig = path.join(process.cwd(), 'tmp', 'test-fixtures', 'composer.config.js')
    
    b.spawn('bun', ['bin/composer.mjs', 'build', '--config', testConfig, '--verbose'], {
      cwd: process.cwd()
    })
    
    await b.expect('Build completed', 20000)
    
    console.log('✅ Composer verbose build test passed')
  })
}

async function testComposerBuildNonExistent() {
  const battle = new Battle({
    name: 'composer-build-error-test',
    timeout: 10000
  })

  return await battle.run(async (b) => {
    console.log('🧪 Testing composer build with non-existent config...')
    
    b.spawn('bun', ['bin/composer.mjs', 'build', '--config', 'non-existent.js'], {
      cwd: process.cwd()
    })
    
    // Should fail with error
    await b.expect('Error', 5000)
    
    console.log('✅ Composer error handling test passed')
  })
}

async function runAllComposerTests() {
  console.log('🎯 Starting @akaoio/composer Battle tests (recovered)')
  
  const tests = [
    { name: 'Help Command', fn: testComposerHelp },
    { name: 'Version Command', fn: testComposerVersion },
    { name: 'Build Command', fn: testComposerBuild },
    { name: 'Verbose Build', fn: testComposerBuildVerbose },
    { name: 'Error Handling', fn: testComposerBuildNonExistent }
  ]
  
  const results = []
  
  for (const test of tests) {
    try {
      console.log(`\n▶️ Running ${test.name}...`)
      await test.fn()
      results.push({ name: test.name, status: 'passed' })
      console.log(`✅ ${test.name} PASSED`)
    } catch (error) {
      results.push({ name: test.name, status: 'failed', error: error.message })
      console.error(`❌ ${test.name} FAILED:`, error.message)
    }
  }
  
  // Summary
  console.log('\n📋 Composer Battle Test Summary:')
  console.log('===================================')
  
  const passed = results.filter(r => r.status === 'passed').length
  const failed = results.filter(r => r.status === 'failed').length
  
  results.forEach(result => {
    const icon = result.status === 'passed' ? '✅' : '❌'
    console.log(`${icon} ${result.name}`)
    if (result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    process.exit(1)
  } else {
    console.log('\n🎉 All composer tests passed!')
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllComposerTests().catch(error => {
    console.error('💥 Composer test runner failed:', error)
    process.exit(1)
  })
}

module.exports = { runAllComposerTests }