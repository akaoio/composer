#!/usr/bin/env node

// Composer CLI - Generate documentation from atoms and templates
const BuildPipeline = require('./dist/BuildPipeline/index.cjs').default || require('./dist/BuildPipeline/index.cjs')
const ConfigLoader = require('./dist/ConfigLoader/index.cjs').default || require('./dist/ConfigLoader/index.cjs')
const fs = require('fs')
const path = require('path')

async function main() {
    try {
        // Load configuration
        const configPath = path.resolve(process.cwd(), 'composer.config.js')
        
        if (!fs.existsSync(configPath)) {
            console.error('❌ No composer.config.js found in current directory')
            process.exit(1)
        }
        
        const config = require(configPath)
        
        // Create build pipeline
        const pipeline = new BuildPipeline(config)
        
        // Execute build
        console.log('📝 Generating documentation with Composer...')
        const results = await pipeline.execute()
        
        if (results && results.length > 0) {
            console.log('✅ Documentation generated successfully')
            results.forEach(result => {
                if (result.target) {
                    console.log(`  📄 ${result.target}`)
                }
            })
        } else {
            console.log('⚠️  No documentation generated')
        }
        
    } catch (error) {
        console.error('❌ Error generating documentation:', error.message)
        process.exit(1)
    }
}

main()