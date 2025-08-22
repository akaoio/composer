import path from 'path'

export async function processImportChain(this: any, filePath: string): Promise<any> {
  // Reset context for new chain
  this.context.importChain = []
  this.context.loadedFiles.clear()
  this.context.baseDir = path.dirname(filePath)

  // Start the import chain
  return await this.loadImportedFile(filePath)
}