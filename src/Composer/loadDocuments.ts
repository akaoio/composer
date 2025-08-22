import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { Document } from '../type/index.js'

export async function loadDocuments(this: any): Promise<void> {
  const documentsPath = this.options.documentsPath
  
  if (!await fs.access(documentsPath).then(() => true).catch(() => false)) {
    console.log(`Documents directory not found: ${documentsPath}`)
    return
  }

  this.context.documents = {}
  await loadDirectory(documentsPath, this.context.documents)
}

async function loadDirectory(dirPath: string, documents: Record<string, Document>) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    
    if (entry.isDirectory()) {
      await loadDirectory(fullPath, documents)
    } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
      const content = await fs.readFile(fullPath, 'utf-8')
      const document = yaml.load(content) as Document
      
      if (document && document.name) {
        documents[document.name] = document
      }
    }
  }
}