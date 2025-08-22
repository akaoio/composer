import { promises as fs } from 'fs'
import path from 'path'
import { Template } from '../Template/index.js'

export async function compose(this: any): Promise<Map<string, string>> {
  const outputs = new Map<string, string>()
  
  // Load all data first
  await this.loadParticles()
  await this.loadComponents()
  await this.loadDocuments()
  
  // Compose each document
  if (this.context.documents) {
    for (const [name, document] of Object.entries(this.context.documents)) {
      const content = await this.composeDocument(document)
      outputs.set(name, content)
      
      // Write to output if outputPath is specified
      if (this.options.outputPath) {
        const outputFile = path.join(this.options.outputPath, `${name}.md`)
        await fs.mkdir(path.dirname(outputFile), { recursive: true })
        await fs.writeFile(outputFile, content, 'utf-8')
      }
    }
  }
  
  return outputs
}