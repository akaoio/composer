import { ConfigLoader, type ComposerConfig } from '../dist/index.js'
import { promises as fs } from 'fs'
import path from 'path'

describe('ConfigLoader', () => {
  let loader: ConfigLoader
  let testDir: string

  beforeEach(async () => {
    testDir = path.join(process.cwd(), 'tmp', 'config-test-' + Date.now())
    await fs.mkdir(testDir, { recursive: true })
    loader = new ConfigLoader()
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('loadConfig', () => {
    test('should load basic config file', async () => {
      const configPath = path.join(testDir, 'composer.config.json')
      await fs.writeFile(configPath, JSON.stringify({
        sources: {},
        build: { tasks: [] },
        outputs: []
      }))

      const config = await loader.loadConfig(configPath)
      
      expect(config).toBeDefined()
      expect(config.sources).toBeDefined()
      expect(config.build).toBeDefined()
      expect(config.outputs).toBeDefined()
    })

    test('should handle config with sources', async () => {
      const configPath = path.join(testDir, 'composer.config.json')
      await fs.writeFile(configPath, JSON.stringify({
        sources: {
          docs: {
            pattern: '**/*.md',
            parser: 'markdown'
          }
        },
        build: { tasks: [] },
        outputs: []
      }))

      const config = await loader.loadConfig(configPath)
      
      expect(config.sources.docs).toBeDefined()
      expect(config.sources.docs.pattern).toBe('**/*.md')
      expect(config.sources.docs.parser).toBe('markdown')
    })

    test('should handle missing config file', async () => {
      const configPath = path.join(testDir, 'nonexistent.config.js')
      
      await expect(loader.loadConfig(configPath)).rejects.toThrow()
    })
  })

  describe('validateConfig', () => {
    test('should validate valid config', () => {
      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: []
      }

      expect(() => loader.validateConfig(config)).not.toThrow()
    })

    test('should throw for invalid config', () => {
      const invalidConfig = {
        sources: {},
        // missing build
        outputs: []
      } as any

      expect(() => loader.validateConfig(invalidConfig)).toThrow()
    })
  })

  describe('resolveConfig', () => {
    test('should resolve config with defaults', () => {
      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: []
      }

      const resolved = loader.resolveConfig(config)
      
      expect(resolved).toBeDefined()
      expect(resolved.sources).toBeDefined()
    })
  })
})