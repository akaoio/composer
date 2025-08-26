import { promises as fs } from 'fs'
import path from 'path'

export async function walkDir(this: any, dirPath: string, callback: (filePath: string) => void): Promise<void> {
  
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