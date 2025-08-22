import { promises as fs } from 'fs'
import path from 'path'

export async function processOutputs(this: any): Promise<Map<string, string>> {
  const outputs = new Map<string, string>()
  
  for (const outputConfig of this.config.outputs) {
    // Get processor
    const processor = this.processors.get(outputConfig.processor)
    if (!processor) {
      throw new Error(`Processor '${outputConfig.processor}' not found for output`)
    }
    
    // Determine input data - use entire context by default
    const input = this.context
    
    // Process output
    const result = await processor.process(input, outputConfig.options || {}, this.context)
    
    // Handle flexible target patterns
    const targets = await this.resolveOutputTargets(outputConfig.target, result)
    
    for (const target of targets) {
      // Resolve target path
      const targetPath = path.resolve(this.config.options?.baseDir || process.cwd(), target.path)
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      
      // Get content for this specific target
      const content = target.content || (typeof result === 'string' ? result : JSON.stringify(result, null, 2))
      
      // Apply target-specific formatting
      const finalContent = await this.formatOutput(content, outputConfig.format, target.options)
      
      // Write output
      await fs.writeFile(targetPath, finalContent, 'utf-8')
      
      // Use filename as key for easier testing
      const outputKey = path.basename(target.path)
      outputs.set(outputKey, finalContent)
      console.log(`✅ Generated: ${targetPath}`)
    }
  }
  
  return outputs
}