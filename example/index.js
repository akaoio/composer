import { Composer } from '../dist/index.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function demo() {
  console.log('🔬 Atomic Composer Demo')
  console.log('========================\n')
  
  const composer = new Composer({
    particlesPath: join(__dirname, 'particles'),
    documentsPath: join(__dirname, 'documents'),
    outputPath: join(__dirname, 'output')
  })
  
  // Add timestamp to context
  composer.context.custom = {
    timestamp: new Date().toISOString()
  }
  
  console.log('📦 Loading particles and documents...')
  const outputs = await composer.compose()
  
  console.log(`✅ Composed ${outputs.size} documents:`)
  for (const [name, content] of outputs) {
    console.log(`\n📄 ${name}:`)
    console.log(content.substring(0, 200) + '...')
  }
  
  // Start watching for changes
  console.log('\n👀 Watching for changes (press Ctrl+C to stop)...')
  composer.watch((newOutputs) => {
    console.log(`\n🔄 Recomposed ${newOutputs.size} documents at ${new Date().toLocaleTimeString()}`)
  })
}

demo().catch(console.error)