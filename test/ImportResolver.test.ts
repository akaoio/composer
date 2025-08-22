import { ImportResolver } from '../dist/index.js'
import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'

describe('ImportResolver', () => {
  let resolver: ImportResolver
  let testDir: string

  beforeEach(async () => {
    testDir = path.join(process.cwd(), 'tmp', 'import-test-' + Date.now())
    await fs.mkdir(testDir, { recursive: true })
    
    resolver = new ImportResolver()
    resolver.context.baseDir = testDir
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('parseImports', () => {
    test('should parse YAML imports', () => {
      const yamlContent = `
import: ./config.json
imports:
  - ./data.yaml
  - source: ./metadata.json
    alias: meta
`

      const imports = resolver.parseImports(yamlContent, 'yaml')
      
      expect(imports).toHaveLength(3)
      expect(imports[0].source).toBe('./config.json')
      expect(imports[1].source).toBe('./data.yaml')
      expect(imports[2].source).toBe('./metadata.json')
      expect(imports[2].alias).toBe('meta')
    })

    test('should parse JSON imports', () => {
      const jsonContent = `{
        "import": "./config.yaml",
        "imports": [
          "./data.json",
          {
            "source": "./api.yaml",
            "select": "endpoints",
            "alias": "api"
          }
        ]
      }`

      const imports = resolver.parseImports(jsonContent, 'json')
      
      expect(imports).toHaveLength(3)
      expect(imports[0].source).toBe('./config.yaml')
      expect(imports[1].source).toBe('./data.json')
      expect(imports[2].source).toBe('./api.yaml')
      expect(imports[2].select).toBe('endpoints')
      expect(imports[2].alias).toBe('api')
    })

    test('should parse Markdown imports', () => {
      const mdContent = `---
import: ./metadata.yaml
imports:
  - ./content.md
---

# Document

Some inline import: {{import: ./data.json}}

More content here.`

      const imports = resolver.parseImports(mdContent, 'markdown')
      
      expect(imports).toHaveLength(3)
      expect(imports[0].source).toBe('./metadata.yaml')
      expect(imports[1].source).toBe('./content.md')
      expect(imports[2].source).toBe('./data.json')
      expect(imports[2].type).toBe('inline')
    })
  })

  describe('loadImportedFile', () => {
    test('should load JSON file', async () => {
      const jsonFile = path.join(testDir, 'data.json')
      const jsonData = { name: 'test', value: 42 }
      
      await fs.writeFile(jsonFile, JSON.stringify(jsonData))

      const result = await resolver.loadImportedFile(jsonFile)
      
      expect(result).toEqual(jsonData)
    })

    test('should load YAML file', async () => {
      const yamlFile = path.join(testDir, 'config.yaml')
      const yamlData = { 
        app: { name: 'Test App' },
        database: { host: 'localhost' }
      }
      
      await fs.writeFile(yamlFile, yaml.dump(yamlData))

      const result = await resolver.loadImportedFile(yamlFile)
      
      expect(result).toEqual(yamlData)
    })

    test('should load Markdown file with frontmatter', async () => {
      const mdFile = path.join(testDir, 'document.md')
      const mdContent = `---
title: Test Document
author: Test Author
---

# Content

This is the document content.`
      
      await fs.writeFile(mdFile, mdContent)

      const result = await resolver.loadImportedFile(mdFile)
      
      expect(result.title).toBe('Test Document')
      expect(result.author).toBe('Test Author')
      expect(result.content).toContain('This is the document content')
    })

    test('should cache loaded files', async () => {
      const jsonFile = path.join(testDir, 'cache-test.json')
      await fs.writeFile(jsonFile, '{"cached": true}')

      // Load twice
      const result1 = await resolver.loadImportedFile(jsonFile)
      const result2 = await resolver.loadImportedFile(jsonFile)
      
      expect(result1).toBe(result2) // Should be same reference (cached)
      expect(resolver.context.loadedFiles.has(jsonFile)).toBe(true)
    })
  })

  describe('resolveImport', () => {
    test('should resolve simple import', async () => {
      const dataFile = path.join(testDir, 'data.json')
      await fs.writeFile(dataFile, '{"name": "resolved"}')

      const result = await resolver.resolveImport({
        source: './data.json'
      })

      expect(result.data.name).toBe('resolved')
      expect(result.source).toBe(dataFile)
    })

    test('should resolve import with alias', async () => {
      const configFile = path.join(testDir, 'config.yaml')
      await fs.writeFile(configFile, yaml.dump({ port: 3000 }))

      const result = await resolver.resolveImport({
        source: './config.yaml',
        alias: 'appConfig'
      })

      expect(result.alias).toBe('appConfig')
      expect(result.data.port).toBe(3000)
    })

    test('should resolve import with selection', async () => {
      const apiFile = path.join(testDir, 'api.json')
      const apiData = {
        endpoints: {
          users: '/api/users',
          posts: '/api/posts'
        },
        version: 'v1'
      }
      
      await fs.writeFile(apiFile, JSON.stringify(apiData))

      const result = await resolver.resolveImport({
        source: './api.json',
        select: 'endpoints.users'
      })

      expect(result.data).toBe('/api/users')
    })

    test('should detect circular imports', async () => {
      // Create files that import each other
      const file1 = path.join(testDir, 'file1.yaml')
      const file2 = path.join(testDir, 'file2.yaml')
      
      await fs.writeFile(file1, yaml.dump({
        import: './file2.yaml',
        data: 'file1'
      }))
      
      await fs.writeFile(file2, yaml.dump({
        import: './file1.yaml',
        data: 'file2'
      }))

      await expect(
        resolver.resolveImport({ source: './file1.yaml' })
      ).rejects.toThrow('Circular import detected')
    })
  })

  describe('processImportChain', () => {
    test('should process nested imports', async () => {
      // Create nested import structure
      const baseFile = path.join(testDir, 'base.yaml')
      const configFile = path.join(testDir, 'config.json')
      const dataFile = path.join(testDir, 'data.yaml')
      
      await fs.writeFile(configFile, JSON.stringify({
        database: { host: 'localhost', port: 5432 }
      }))
      
      await fs.writeFile(dataFile, yaml.dump({
        import: './config.json',
        tables: ['users', 'posts']
      }))
      
      await fs.writeFile(baseFile, yaml.dump({
        import: './data.yaml',
        app: { name: 'Test App' }
      }))

      const result = await resolver.processImportChain(baseFile)
      
      expect(result.app.name).toBe('Test App')
      expect(result.tables).toEqual(['users', 'posts'])
      expect(result.database.host).toBe('localhost')
    })

    test('should handle imports with aliases in chain', async () => {
      const mainFile = path.join(testDir, 'main.yaml')
      const serverFile = path.join(testDir, 'server.json')
      const dbFile = path.join(testDir, 'database.yaml')
      
      await fs.writeFile(dbFile, yaml.dump({
        host: 'localhost',
        port: 5432,
        name: 'app_db'
      }))
      
      await fs.writeFile(serverFile, JSON.stringify({
        imports: [{
          source: './database.yaml',
          alias: 'db'
        }],
        port: 3000
      }))
      
      await fs.writeFile(mainFile, yaml.dump({
        imports: [{
          source: './server.json',
          alias: 'server'
        }],
        app: { name: 'Main App' }
      }))

      const result = await resolver.processImportChain(mainFile)
      
      expect(result.app.name).toBe('Main App')
      expect(result.server.port).toBe(3000)
      expect(result.server.db.host).toBe('localhost')
    })
  })
})