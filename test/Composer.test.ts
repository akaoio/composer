import { Composer } from '../src/Composer/index.js'
import { promises as fs } from 'fs'
import path from 'path'

describe('Composer', () => {
  let composer: Composer
  let testDir: string

  beforeEach(async () => {
    testDir = path.join(process.cwd(), 'tmp', 'test-' + Date.now())
    
    composer = new Composer({
      particlesPath: path.join(testDir, 'particles'),
      documentsPath: path.join(testDir, 'documents'),
      outputPath: path.join(testDir, 'output')
    })

    // Create test directory structure
    await fs.mkdir(path.join(testDir, 'particles', 'text'), { recursive: true })
    await fs.mkdir(path.join(testDir, 'documents'), { recursive: true })
    
    // Create test particle
    await fs.writeFile(
      path.join(testDir, 'particles', 'text', 'greeting.yaml'),
      `name: greeting
type: text
category: text
content: "Hello, World!"
`
    )
    
    // Create test document
    await fs.writeFile(
      path.join(testDir, 'documents', 'test.yaml'),
      `name: test
template: |
  # Test Document
  
  {{particles.text.greeting.content}}
`
    )
  })

  afterEach(async () => {
    composer.stop()
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('constructor', () => {
    test('should initialize with default options', () => {
      const defaultComposer = new Composer()
      
      expect(defaultComposer.options.particlesPath).toBe('./particles')
      expect(defaultComposer.options.documentsPath).toBe('./documents')
      expect(defaultComposer.options.outputPath).toBe('./output')
      expect(defaultComposer.options.debounceMs).toBe(1000)
    })

    test('should initialize with custom options', () => {
      expect(composer.options.particlesPath).toBe(path.join(testDir, 'particles'))
      expect(composer.options.documentsPath).toBe(path.join(testDir, 'documents'))
      expect(composer.options.outputPath).toBe(path.join(testDir, 'output'))
    })
  })

  describe('loadParticles', () => {
    test('should load particles from directory', async () => {
      await composer.loadParticles()
      
      expect(composer.context.particles).toHaveProperty('text')
      expect(composer.context.particles.text).toHaveProperty('greeting')
      expect(composer.context.particles.text.greeting.content).toBe('Hello, World!')
    })

    test('should handle missing particles directory', async () => {
      const emptyComposer = new Composer({
        particlesPath: path.join(testDir, 'nonexistent')
      })
      
      await expect(emptyComposer.loadParticles()).resolves.not.toThrow()
      expect(Object.keys(emptyComposer.context.particles)).toHaveLength(0)
    })
  })

  describe('loadDocuments', () => {
    test('should load documents from directory', async () => {
      await composer.loadDocuments()
      
      expect(composer.context.documents).toHaveProperty('test')
      expect(composer.context.documents!.test.name).toBe('test')
    })
  })

  describe('compose', () => {
    test('should compose documents successfully', async () => {
      const outputs = await composer.compose()
      
      expect(outputs.size).toBe(1)
      expect(outputs.has('test')).toBe(true)
      
      const content = outputs.get('test')!
      expect(content).toContain('# Test Document')
      expect(content).toContain('Hello, World!')
    })

    test('should write output files when outputPath is specified', async () => {
      await composer.compose()
      
      const outputFile = path.join(testDir, 'output', 'test.md')
      const exists = await fs.access(outputFile).then(() => true).catch(() => false)
      expect(exists).toBe(true)
      
      const content = await fs.readFile(outputFile, 'utf-8')
      expect(content).toContain('# Test Document')
      expect(content).toContain('Hello, World!')
    })
  })
})