export async function walkDir(this: any, dirPath: string, callback: (filePath: string) => void): Promise<void> {
  const fs = require('fs').promises
  const path = require('path')
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        await this.walkDir(fullPath, callback)
      } else {
        callback(fullPath)
      }
    }
  } catch (error) {
    // Ignore errors for non-existent directories
  }
}