#!/usr/bin/env node

/**
 * ERP System Example Runner
 * Generates all ERP documentation using @akaoio/composer
 */

const { Composer } = require('../../dist/index.js')
const { existsSync } = require('fs')
const { resolve } = require('path')

async function run() {
  console.log('🚀 Starting ERP System Documentation Generation...\n')
  
  const configPath = resolve('./composer.config.js')
  
  if (!existsSync(configPath)) {
    console.error('❌ Config file not found:', configPath)
    process.exit(1)
  }
  
  try {
    const composer = new Composer()
    await composer.render(configPath)
    
    console.log('\n✅ ERP System documentation generated successfully!')
    console.log('\n📁 Output files created:')
    console.log('  - output/dashboard/company-overview.md')
    console.log('  - output/agents/*.md (individual profiles)')
    console.log('  - output/projects/*-dashboard.md')
    console.log('  - output/reports/sprint-*.md')
    console.log('  - output/reports/team-performance.md')
    console.log('  - output/reports/system-health.md')
    console.log('  - output/tasks/*.md (task details)')
    
    console.log('\n📊 View the generated reports in the output/ directory')
  } catch (error) {
    console.error('❌ Error generating documentation:', error.message)
    process.exit(1)
  }
}

run()