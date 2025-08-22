import path from 'path'
import type { ImportConfig, ImportResult } from '../type/index.js'

export async function resolveImport(
  this: any,
  importConfig: ImportConfig, 
  baseDir?: string
): Promise<ImportResult> {
  const resolveDir = baseDir || this.context.baseDir
  
  // Resolve import path
  const importPath = path.isAbsolute(importConfig.source) 
    ? importConfig.source
    : path.resolve(resolveDir, importConfig.source)

  // Check for circular imports
  if (this.context.importChain.includes(importPath)) {
    throw new Error(`Circular import detected: ${this.context.importChain.join(' -> ')} -> ${importPath}`)
  }

  try {
    // Add to import chain
    this.context.importChain.push(importPath)

    // Load the imported file
    const importedData = await this.loadImportedFile(importPath)
    
    // Apply selector if specified
    let selectedData = importedData
    if (importConfig.select) {
      selectedData = this.selectFromData(importedData, importConfig.select)
    }

    // Apply alias if specified
    const result: ImportResult = {
      source: importPath,
      data: selectedData,
      alias: importConfig.alias
    }

    return result

  } finally {
    // Remove from import chain
    this.context.importChain.pop()
  }
}

function selectFromData(data: any, selector: string): any {
  const keys = selector.split('.')
  let current = data
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      throw new Error(`Cannot select '${selector}' from imported data`)
    }
    current = current[key]
  }
  
  return current
}