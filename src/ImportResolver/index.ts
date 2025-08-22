import { resolveImport } from './resolveImport.js'
import { parseImports } from './parseImports.js'
import { loadImportedFile } from './loadImportedFile.js'
import { processImportChain } from './processImportChain.js'
import type { ImportConfig, ImportResult, ImportContext } from '../type/index.js'

export class ImportResolver {
  context: ImportContext

  constructor() {
    this.context = {
      loadedFiles: new Map(),
      importChain: [],
      baseDir: process.cwd()
    }
  }

  async resolveImport(importConfig: ImportConfig, baseDir?: string): Promise<ImportResult> {
    return resolveImport.call(this, importConfig, baseDir)
  }

  parseImports(content: string, format: 'yaml' | 'json' | 'markdown'): ImportConfig[] {
    return parseImports.call(this, content, format)
  }

  async loadImportedFile(filePath: string): Promise<any> {
    return loadImportedFile.call(this, filePath)
  }

  async processImportChain(filePath: string): Promise<any> {
    return processImportChain.call(this, filePath)
  }

  selectFromData(data: any, selector: string): any {
    const keys = selector.split('.')
    let current = data
    
    for (const key of keys) {
      if (current == null || typeof current !== 'object') {
        return undefined
      }
      current = current[key]
    }
    
    return current
  }
}

export default ImportResolver