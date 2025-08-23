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
    data = await resolveImportsInData.call(this, data, path.dirname(filePath))
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

async function resolveImportsInData(this: any, data: any, baseDir: string): Promise<any> {
  // Handle string imports like "import:path/to/file"
  if (typeof data === 'string' && data.startsWith('import:')) {
    const importPath = path.resolve(baseDir, data.substring(7))
    return await this.loadImportedFile(importPath)
  }
  
  if (!data || typeof data !== 'object') return data

  if (Array.isArray(data)) {
    // Process array items
    const resolved = []
    for (const item of data) {
      if (typeof item === 'string' && item.startsWith('import:')) {
        // Handle string import directive
        const importPath = path.resolve(baseDir, item.substring(7))
        const importedData = await this.loadImportedFile(importPath)
        resolved.push(importedData)
      } else if (item && typeof item === 'object' && item.import) {
        // Replace import directive with loaded data
        const importPath = path.resolve(baseDir, item.import)
        const importedData = await this.loadImportedFile(importPath)
        resolved.push(importedData)
      } else {
        // Recursively process nested data
        resolved.push(await resolveImportsInData.call(this, item, baseDir))
      }
    }
    return resolved
  } else {
    // Process object properties
    const resolved: any = {}
    for (const [key, value] of Object.entries(data)) {
      if (key === 'import' && typeof value === 'string') {
        // Replace entire object with imported data
        const importPath = path.resolve(baseDir, value)
        return await this.loadImportedFile(importPath)
      } else if (key === 'imports' && Array.isArray(value)) {
        // Handle multiple imports (merge them)
        const merged: any = {}
        for (const imp of value) {
          const importPath = path.resolve(baseDir, typeof imp === 'string' ? imp : imp.import)
          const importedData = await this.loadImportedFile(importPath)
          Object.assign(merged, importedData)
        }
        return merged
      } else {
        // Recursively process nested data
        resolved[key] = await resolveImportsInData.call(this, value, baseDir)
      }
    }
    return resolved
  }
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