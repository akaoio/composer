import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { glob } from 'glob'
import type { SourceConfig } from '../type/config.js'
import { ImportResolver } from '../ImportResolver/index.js'

export async function loadSources(this: any): Promise<void> {
  console.log('📁 Loading sources...')
  
  const importResolver = new ImportResolver()
  
  for (const [name, sourceConfig] of Object.entries(this.config.sources)) {
    const config = sourceConfig as SourceConfig
    
    // Resolve patterns (support regex patterns)
    const patterns = Array.isArray(config.pattern) 
      ? config.pattern 
      : [config.pattern]
    
    const files: string[] = []
    const baseDir = this.config.options?.baseDir || process.cwd()
    
    for (const pattern of patterns) {
      let matches: string[] = []
      
      // Check if pattern is a regex (must start and end with /)
      if (pattern.match(/^\/.*\/[gimuy]*$/)) {
        // Handle regex patterns
        matches = await this.resolveRegexPattern(pattern, baseDir)
      } else {
        // Handle glob patterns - use absolute pattern if provided, else relative to baseDir
        const globOptions = {
          ignore: config.exclude || ['**/node_modules/**', '**/dist/**'],
          absolute: true
        }
        
        // If pattern is already absolute, use it as is, otherwise make it relative to baseDir
        const fullPattern = path.isAbsolute(pattern) ? pattern : path.join(baseDir, pattern)
        matches = await glob(fullPattern, globOptions)
      }
      
      files.push(...matches)
    }
    
    // Load and parse files with import resolution
    const sourceData: any[] = []
    
    for (const file of files) {
      const fullPath = path.isAbsolute(file) ? file : path.resolve(baseDir, file)
      const relativePath = path.relative(baseDir, fullPath)
      let parsed: any
      
      try {
        // Use ImportResolver to handle cross-format imports
        parsed = await importResolver.processImportChain(fullPath)
        
        // Apply parser-specific processing
        switch (config.parser) {
          case 'yaml':
            if (typeof parsed === 'string') {
              parsed = yaml.load(parsed)
            }
            break
          case 'json':
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed)
            }
            break
          case 'markdown':
            if (!parsed.content && typeof parsed === 'string') {
              parsed = { content: parsed, type: 'markdown' }
            }
            break
          default:
            // Keep as-is for custom parsers
        }
        
        // Apply transform if present
        if (config.transform) {
          parsed = config.transform(parsed, { 
            path: relativePath, 
            name: path.basename(relativePath, path.extname(relativePath)) 
          })
        }
        
        // Add file metadata
        parsed._meta = {
          file: relativePath,
          fullPath: fullPath,
          source: name,
          lastModified: (await fs.stat(fullPath)).mtime
        }
        
        sourceData.push(parsed)
        
        // Store file info for watching
        this.context.files.set(relativePath, {
          path: relativePath,
          fullPath,
          source: name,
          data: parsed
        })
        
      } catch (error) {
        console.warn(`    Failed to load ${relativePath}:`, error)
        continue
      }
    }
    
    // Store as array for better handling of bulk operations
    this.context.sources[name] = sourceData
  }
}