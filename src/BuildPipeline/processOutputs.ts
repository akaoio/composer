import { promises as fs } from 'fs'
import path from 'path'

export async function processOutputs(this: any): Promise<Map<string, string>> {
  const outputs = new Map<string, string>()
  
  for (const outputConfig of this.config.outputs) {
    let result: any
    
    // Check if template is specified
    if (outputConfig.template) {
      // Read template file
      const templatePath = path.resolve(this.config.options?.baseDir || process.cwd(), outputConfig.template)
      const templateContent = await fs.readFile(templatePath, 'utf-8')
      
      // Render template with context
      result = await this.renderTemplate(templateContent, this.context)
    } else if (outputConfig.processor) {
      // Get processor
      const processor = this.processors.get(outputConfig.processor)
      if (!processor) {
        throw new Error(`Processor '${outputConfig.processor}' not found for output`)
      }
      
      // Determine input data - use entire context by default
      const input = this.context
      
      // Process output
      result = await processor.process(input, outputConfig.options || {}, this.context)
    } else {
      throw new Error('Output must specify either a template or a processor')
    }
    
    // Handle flexible target patterns
    // When using forEach, pass the context data instead of the rendered template
    const dataForTargets = (typeof outputConfig.target === 'object' && outputConfig.target.forEach) 
      ? this.context 
      : result
    const targets = await this.resolveOutputTargets(outputConfig.target, dataForTargets)
    
    for (const target of targets) {
      // Resolve target path
      const targetPath = path.resolve(this.config.options?.baseDir || process.cwd(), target.path)
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      
      // Get content for this specific target
      let content
      if (target.context && outputConfig.template) {
        // For forEach items, render the template with the item's context
        const templatePath = path.resolve(this.config.options?.baseDir || process.cwd(), outputConfig.template)
        const templateContent = await fs.readFile(templatePath, 'utf-8')
        content = await this.renderTemplate(templateContent, target.context)
      } else {
        content = target.content || (typeof result === 'string' ? result : JSON.stringify(result, null, 2))
      }
      
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