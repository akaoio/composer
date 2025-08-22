import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export async function loadImportedFile(this: any, filePath: string): Promise<any> {
  // Check cache first
  if (this.context.loadedFiles.has(filePath)) {
    return this.context.loadedFiles.get(filePath)
  }

  // Check if file exists
  try {
    await fs.access(filePath)
  } catch (error) {
    throw new Error(`Import file not found: ${filePath}`)
  }

  // Read file content
  const content = await fs.readFile(filePath, 'utf-8')
  const ext = path.extname(filePath).toLowerCase()
  
  let data: any
  
  // Parse based on file extension
  switch (ext) {
    case '.json':
      data = JSON.parse(content)
      break
      
    case '.yaml':
    case '.yml':
      data = yaml.load(content)
      break
      
    case '.md':
    case '.markdown':
      data = parseMarkdownFile.call(this, content, filePath)
      break
      
    default:
      // Treat as plain text
      data = { content, filePath }
  }

  // Process nested imports in the loaded file
  if (data && typeof data === 'object') {
    const nestedImports = this.parseImports(content, getFormatFromExtension.call(this, ext))
    
    if (nestedImports.length > 0) {
      const baseDir = path.dirname(filePath)
      
      // Store original data before merging imports
      const originalData = { ...data }
      
      for (const importConfig of nestedImports) {
        const importResult = await this.resolveImport(importConfig, baseDir)
        
        if (importConfig.alias) {
          data[importConfig.alias] = importResult.data
        } else {
          // Merge imported data - imported data provides base, original data overrides
          if (typeof importResult.data === 'object' && !Array.isArray(importResult.data)) {
            Object.assign(data, importResult.data, originalData)
          }
        }
      }
    }
  }

  // Cache the result
  this.context.loadedFiles.set(filePath, data)
  
  return data
}

function parseMarkdownFile(this: any, content: string, filePath: string): any {
  const result: any = {
    content,
    filePath,
    name: path.basename(filePath, path.extname(filePath))
  }

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (frontmatterMatch) {
    try {
      const frontmatter = yaml.load(frontmatterMatch[1])
      const body = frontmatterMatch[2]
      
      Object.assign(result, frontmatter)
      result.content = body
      result.raw = content
    } catch (error) {
      // Keep original content if frontmatter parsing fails
    }
  }

  return result
}

function getFormatFromExtension(this: any, ext: string): 'yaml' | 'json' | 'markdown' {
  switch (ext) {
    case '.json':
      return 'json'
    case '.yaml':
    case '.yml':
      return 'yaml'
    case '.md':
    case '.markdown':
      return 'markdown'
    default:
      return 'yaml' // Default fallback
  }
}