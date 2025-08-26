import yaml from 'js-yaml'
import type { ImportConfig } from '../type/index.js'

export function parseImports(
  this: any,
  content: string, 
  format: 'yaml' | 'json' | 'markdown'
): ImportConfig[] {
  const imports: ImportConfig[] = []

  switch (format) {
    case 'yaml':
      imports.push(...parseYamlImports.call(this, content))
      break
    case 'json':
      imports.push(...parseJsonImports.call(this, content))
      break
    case 'markdown':
      imports.push(...parseMarkdownImports.call(this, content))
      break
  }

  return imports
}

function parseYamlImports(this: any, content: string): ImportConfig[] {
  try {
    const data = yaml.load(content) as any
    const imports: ImportConfig[] = []
    const self = this

    // Recursively find all import directives
    function findImports(obj: any, currentPath: string[] = []): void {
      if (!obj || typeof obj !== 'object') return

      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (item && typeof item === 'object' && item.import) {
            imports.push(normalizeImportConfig.call(self, item.import))
          } else {
            findImports(item, [...currentPath, String(index)])
          }
        })
      } else {
        Object.entries(obj).forEach(([key, value]) => {
          if (key === 'import' && typeof value === 'string') {
            imports.push(normalizeImportConfig.call(self, value))
          } else if (key === 'imports' && Array.isArray(value)) {
            value.forEach(imp => {
              imports.push(normalizeImportConfig.call(self, imp))
            })
          } else {
            findImports(value, [...currentPath, key])
          }
        })
      }
    }

    findImports(data)
    return imports
  } catch (error) {
    return []
  }
}

function parseJsonImports(this: any, content: string): ImportConfig[] {
  try {
    const data = JSON.parse(content)
    const imports: ImportConfig[] = []
    const self = this

    // Recursively find all import directives (same as YAML)
    function findImports(obj: any, currentPath: string[] = []): void {
      if (!obj || typeof obj !== 'object') return

      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'string' && item.startsWith('import:')) {
            // Handle string imports like "import:../path/to/file.json"
            imports.push(normalizeImportConfig.call(self, item.substring(7)))
          } else if (item && typeof item === 'object' && item.import) {
            imports.push(normalizeImportConfig.call(self, item.import))
          } else {
            findImports(item, [...currentPath, String(index)])
          }
        })
      } else {
        Object.entries(obj).forEach(([key, value]) => {
          if (key === 'import' && typeof value === 'string') {
            imports.push(normalizeImportConfig.call(self, value))
          } else if (key === 'imports' && Array.isArray(value)) {
            value.forEach(imp => {
              imports.push(normalizeImportConfig.call(self, imp))
            })
          } else if (typeof value === 'string' && value.startsWith('import:')) {
            // Handle string imports in values
            imports.push(normalizeImportConfig.call(self, value.substring(7)))
          } else {
            findImports(value, [...currentPath, key])
          }
        })
      }
    }

    findImports(data)
    return imports
  } catch (error) {
    return []
  }
}

function parseMarkdownImports(this: any, content: string): ImportConfig[] {
  const imports: ImportConfig[] = []
  
  // Parse frontmatter imports
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    try {
      const frontmatter = yaml.load(frontmatterMatch[1]) as any
      
      if (frontmatter?.import) {
        imports.push(normalizeImportConfig.call(this, frontmatter.import))
      }
      
      if (frontmatter?.imports && Array.isArray(frontmatter.imports)) {
        for (const imp of frontmatter.imports) {
          imports.push(normalizeImportConfig.call(this, imp))
        }
      }
    } catch (error) {
      // Ignore frontmatter parsing errors
    }
  }

  // Parse inline imports: {{import: ./file.yaml}}
  const inlineImportRegex = /\{\{import:\s*([^}]+)\}\}/g
  let match
  while ((match = inlineImportRegex.exec(content)) !== null) {
    imports.push({
      source: match[1].trim(),
      type: 'inline'
    })
  }

  return imports
}

function normalizeImportConfig(this: any, imp: string | ImportConfig): ImportConfig {
  if (typeof imp === 'string') {
    return { source: imp }
  }
  
  if (typeof imp === 'object' && imp.source) {
    return imp
  }
  
  throw new Error(`Invalid import configuration: ${JSON.stringify(imp)}`)
}