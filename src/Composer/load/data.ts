import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export async function data(this: any): Promise<void> {
  const dataPath = this.options.dataPath
  
  if (!await fs.access(dataPath).then(() => true).catch(() => false)) {
    console.log(`Data directory not found: ${dataPath}`)
    return
  }

  this.context.data = {}
  await loadDirectory(dataPath, this.context.data, dataPath)
}

async function loadDirectory(dirPath: string, data: Record<string, any>, basePath: string) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    
    if (entry.isDirectory()) {
      // Create nested structure for subdirectories
      const relativePath = path.relative(basePath, fullPath)
      const segments = relativePath.split(path.sep)
      let target = data
      
      for (const segment of segments) {
        if (!target[segment]) target[segment] = {}
        target = target[segment]
      }
      
      await loadDirectory(fullPath, target, basePath)
    } else if (isDataFile(entry.name)) {
      const content = await fs.readFile(fullPath, 'utf-8')
      const ext = path.extname(entry.name).toLowerCase()
      const name = path.basename(entry.name, ext)
      
      let parsedData: any
      
      switch (ext) {
        case '.json':
          parsedData = JSON.parse(content)
          break
        case '.yaml':
        case '.yml':
          parsedData = yaml.load(content)
          break
        case '.md':
        case '.markdown':
          // Parse frontmatter if present
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
          if (frontmatterMatch) {
            const frontmatter = yaml.load(frontmatterMatch[1]) || {}
            parsedData = { 
              ...(typeof frontmatter === 'object' && frontmatter !== null ? frontmatter : {}),
              content: frontmatterMatch[2].trim() 
            }
          } else {
            parsedData = { content: content.trim() }
          }
          break
        case '.txt':
          parsedData = { content: content.trim() }
          break
        default:
          parsedData = { content }
      }
      
      // Add metadata
      parsedData._meta = {
        file: fullPath,
        name: name,
        ext: ext,
        relativePath: path.relative(basePath, fullPath)
      }
      
      data[name] = parsedData
    }
  }
}

function isDataFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return ['.json', '.yaml', '.yml', '.md', '.markdown', '.txt'].includes(ext)
}