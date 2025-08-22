import { promises as fs } from 'fs'
import path from 'path'
import { Template } from '../Template/index.js'

export async function render(this: any): Promise<Map<string, string>> {
  const outputs = new Map<string, string>()
  
  // Load data first
  await this.loadData()
  
  // Load templates
  const templatesPath = this.options.templatesPath
  if (!await fs.access(templatesPath).then(() => true).catch(() => false)) {
    console.log(`Templates directory not found: ${templatesPath}`)
    return outputs
  }

  // Get all template files
  const templateFiles = await getTemplateFiles(templatesPath)
  
  for (const templateFile of templateFiles) {
    const templateContent = await fs.readFile(templateFile, 'utf-8')
    const template = new Template(templateContent, this.context)
    
    // Render template
    const rendered = template.render()
    
    // Determine output path
    const relativePath = path.relative(templatesPath, templateFile)
    const outputName = path.basename(relativePath, path.extname(relativePath))
    
    outputs.set(outputName, rendered)
    
    // Write to output directory if specified
    if (this.options.outputPath) {
      const outputPath = path.join(this.options.outputPath, `${outputName}.md`)
      await fs.mkdir(path.dirname(outputPath), { recursive: true })
      await fs.writeFile(outputPath, rendered, 'utf-8')
      console.log(`Generated: ${outputPath}`)
    }
  }
  
  return outputs
}

async function getTemplateFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory()) {
      files.push(...await getTemplateFiles(fullPath))
    } else if (isTemplateFile(entry.name)) {
      files.push(fullPath)
    }
  }
  
  return files
}

function isTemplateFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return ['.md', '.html', '.txt', '.yaml', '.json'].includes(ext)
}