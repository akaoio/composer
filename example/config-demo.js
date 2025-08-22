import { Composer } from '../dist/index.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function configDemo() {
  console.log('⚙️ Config-Based Composer Demo')
  console.log('==============================\n')
  
  const composer = new Composer({ verbose: true })
  
  // Register custom processor
  composer.registerProcessor({
    name: 'content-processor',
    process: async (input, options, context) => {
      console.log('🔄 Processing content with custom processor')
      return input
    }
  })
  
  composer.registerProcessor({
    name: 'doc-generator', 
    process: async (input, options, context) => {
      console.log('📝 Generating documentation')
      
      // Combine particles, content, and data
      const particles = context.sources.particles || {}
      const content = context.sources.content || {}
      const data = context.sources.data || {}
      
      return {
        particles,
        content,
        data,
        generated: new Date().toISOString(),
        options
      }
    }
  })
  
  composer.registerProcessor({
    name: 'html-generator',
    process: async (input, options, context) => {
      console.log('🌐 Generating HTML')
      
      const title = options.title || 'Generated Documentation'
      const content = JSON.stringify(input, null, 2)
      
      return `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        pre { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <p>Generated at: ${new Date().toLocaleString()}</p>
    <h2>Data:</h2>
    <pre>${content}</pre>
</body>
</html>`
    }
  })
  
  try {
    // Use config-based composition
    const configPath = join(__dirname, 'composer.config.js')
    const outputs = await composer.composeWithConfig(configPath)
    
    console.log(`\n✅ Generated ${outputs.size} outputs:`)
    for (const [target, content] of outputs) {
      console.log(`📄 ${target} (${content.length} chars)`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

configDemo().catch(console.error)