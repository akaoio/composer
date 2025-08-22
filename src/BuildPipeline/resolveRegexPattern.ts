import { promises as fs } from 'fs'
import path from 'path'

export async function resolveRegexPattern(this: any, pattern: string | RegExp, baseDir: string): Promise<string[]> {
  let regex: RegExp
  
  // Handle RegExp objects directly
  if (pattern instanceof RegExp) {
    regex = pattern
  } else {
    // Parse regex pattern string: /pattern/flags
    const regexMatch = pattern.match(/^\/(.+)\/([gimuy]*)$/)
    if (!regexMatch) {
      throw new Error(`Invalid regex pattern: ${pattern}`)
    }

    const [, regexStr, flags] = regexMatch
    regex = new RegExp(regexStr, flags)
  }
  
  // Walk directory tree and test against regex
  const matches: string[] = []
  
  async function walkDir(dir: string, relativeTo: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.relative(relativeTo, fullPath)
        
        if (entry.isDirectory()) {
          // Skip common ignore directories
          if (!['node_modules', 'tmp', 'dist', '.git'].includes(entry.name)) {
            await walkDir(fullPath, relativeTo)
          }
        } else if (entry.isFile()) {
          // Test file path against regex
          if (regex.test(relativePath) || regex.test(entry.name)) {
            matches.push(relativePath)
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  await walkDir(baseDir, baseDir)
  return matches
}