import { BuildPipeline, type ComposerConfig, type Processor } from '../dist/index.js'
import { promises as fs } from 'fs'
import path from 'path'

describe('BuildPipeline', () => {
  let pipeline: BuildPipeline
  let testDir: string

  beforeEach(async () => {
    testDir = path.join(process.cwd(), 'tmp', 'pipeline-test-' + Date.now())
    await fs.mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('constructor', () => {
    test('should initialize with config', () => {
      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: []
      }

      pipeline = new BuildPipeline(config)
      
      expect(pipeline.config).toBe(config)
      expect(pipeline.context).toBeDefined()
    })
  })

  describe('loadSources', () => {
    test('should load YAML sources', async () => {
      const config: ComposerConfig = {
        sources: {
          particles: {
            pattern: path.join(testDir, '**/*.yaml'),
            parser: 'yaml'
          }
        },
        build: { tasks: [] },
        outputs: []
      }

      pipeline = new BuildPipeline(config)

      // Create test YAML file
      await fs.mkdir(path.join(testDir, 'particles'), { recursive: true })
      await fs.writeFile(
        path.join(testDir, 'particles', 'test.yaml'),
        'name: test\ntype: text\ncontent: Hello'
      )

      await pipeline.loadSources()
      
      expect(pipeline.context.sources.particles).toBeDefined()
      // Single file sources are flattened to object, not array
      expect(pipeline.context.sources.particles.name).toBe('test')
    })

    test('should load JSON sources', async () => {
      const config: ComposerConfig = {
        sources: {
          data: {
            pattern: path.join(testDir, '**/*.json'),
            parser: 'json'
          }
        },
        build: { tasks: [] },
        outputs: []
      }

      pipeline = new BuildPipeline(config)

      // Create test JSON file
      await fs.writeFile(
        path.join(testDir, 'data.json'),
        '{"name": "test", "value": 42}'
      )

      await pipeline.loadSources()
      
      expect(pipeline.context.sources.data).toBeDefined()
      // Single file sources are flattened to object, not array
      expect(pipeline.context.sources.data.name).toBe('test')
    })

    test('should load Markdown sources', async () => {
      const config: ComposerConfig = {
        sources: {
          docs: {
            pattern: path.join(testDir, '**/*.md'),
            parser: 'markdown'
          }
        },
        build: { tasks: [] },
        outputs: []
      }

      pipeline = new BuildPipeline(config)

      // Create test Markdown file
      await fs.writeFile(
        path.join(testDir, 'readme.md'),
        '# Test\n\nThis is a test document.'
      )

      await pipeline.loadSources()
      
      expect(pipeline.context.sources.docs).toBeDefined()
      // Single file sources are flattened to object, not array
      expect(pipeline.context.sources.docs.name).toBe('readme')
    })

    test('should apply source transformations', async () => {
      const config: ComposerConfig = {
        sources: {
          content: {
            pattern: path.join(testDir, '**/*.md'),
            parser: 'markdown',
            transform: (content: any, file: any) => ({
              title: file.name.replace('.md', ''),
              body: content.content,
              path: file.path
            })
          }
        },
        build: { tasks: [] },
        outputs: []
      }

      pipeline = new BuildPipeline(config)

      await fs.writeFile(
        path.join(testDir, 'test-doc.md'),
        '# Test Document\n\nContent here.'
      )

      await pipeline.loadSources()
      
      const source = pipeline.context.sources.content
      expect(source.title).toBe('test-doc')
      expect(source.body).toContain('Content here')
      expect(source.path).toContain('test-doc.md')
    })
  })

  describe('execute', () => {
    test('should execute build tasks', async () => {
      const mockProcessor: Processor = {
        name: 'test-processor',
        process: jest.fn().mockResolvedValue({ processed: true })
      }

      const config: ComposerConfig = {
        sources: {
          test: {
            pattern: path.join(testDir, '**/*.yaml'),
            parser: 'yaml'
          }
        },
        build: {
          tasks: [{
            name: 'process-test',
            input: 'test',
            processor: 'test-processor'
          }]
        },
        outputs: []
      }

      pipeline = new BuildPipeline(config)
      pipeline.registerProcessor(mockProcessor)

      // Create test source
      await fs.writeFile(
        path.join(testDir, 'test.yaml'),
        'name: test\nvalue: 123'
      )

      const outputs = await pipeline.execute()
      
      expect(mockProcessor.process).toHaveBeenCalled()
      expect(outputs).toBeInstanceOf(Map)
    })

    test('should handle task execution errors', async () => {
      const failingProcessor: Processor = {
        name: 'failing-processor',
        process: jest.fn().mockRejectedValue(new Error('Process failed'))
      }

      const config: ComposerConfig = {
        sources: {
          test: {
            pattern: path.join(testDir, '**/*.yaml'),
            parser: 'yaml'
          }
        },
        build: {
          tasks: [{
            name: 'failing-task',
            input: 'test',
            processor: 'failing-processor'
          }]
        },
        outputs: []
      }

      pipeline = new BuildPipeline(config)
      pipeline.registerProcessor(failingProcessor)

      await fs.writeFile(
        path.join(testDir, 'test.yaml'),
        'name: test'
      )

      await expect(pipeline.execute()).rejects.toThrow('Process failed')
    })
  })

  describe('processOutputs', () => {
    test('should generate output files', async () => {
      const outputProcessor: Processor = {
        name: 'output-processor',
        process: jest.fn().mockResolvedValue('Generated content')
      }

      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: [{
          target: path.join(testDir, 'output.md'),
          format: 'markdown',
          processor: 'output-processor'
        }]
      }

      pipeline = new BuildPipeline(config)
      pipeline.registerProcessor(outputProcessor)

      const outputs = await pipeline.execute()
      
      expect(outputProcessor.process).toHaveBeenCalled()
      expect(outputs.size).toBe(1)
      expect(outputs.has('output.md')).toBe(true)
      expect(outputs.get('output.md')).toBe('Generated content')
    })

    test('should handle multiple output targets', async () => {
      const processor: Processor = {
        name: 'multi-processor',
        process: jest.fn().mockResolvedValue('Multi output')
      }

      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: [
          {
            target: [
              path.join(testDir, 'output1.md'),
              path.join(testDir, 'output2.md')
            ],
            format: 'markdown',
            processor: 'multi-processor'
          }
        ]
      }

      pipeline = new BuildPipeline(config)
      pipeline.registerProcessor(processor)

      const outputs = await pipeline.execute()
      
      expect(outputs.size).toBe(2)
      expect(outputs.has('output1.md')).toBe(true)
      expect(outputs.has('output2.md')).toBe(true)
    })
  })

  describe('registerProcessor', () => {
    test('should register custom processor', () => {
      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: []
      }

      pipeline = new BuildPipeline(config)
      
      const processor: Processor = {
        name: 'custom-processor',
        process: jest.fn().mockResolvedValue('result')
      }

      pipeline.registerProcessor(processor)
      
      expect(pipeline.processors.has('custom-processor')).toBe(true)
    })
  })

  describe('formatters', () => {
    beforeEach(() => {
      const config: ComposerConfig = {
        sources: {},
        build: { tasks: [] },
        outputs: []
      }
      pipeline = new BuildPipeline(config)
    })

    test('should format data as XML', async () => {
      const data = { name: 'Test', version: '1.0' }
      const result = await pipeline.formatAsXml(JSON.stringify(data))
      
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<root>')
      expect(result).toContain('<name>Test</name>')
      expect(result).toContain('<version>1.0</version>')
    })

    test('should format data as CSV', async () => {
      const data = [
        { name: 'Item1', value: 100 },
        { name: 'Item2', value: 200 }
      ]
      const result = await pipeline.formatAsCsv(JSON.stringify(data))
      
      // CSV format may include quotes, both formats are valid
      expect(result).toMatch(/"?name"?,"?value"?/)
      expect(result).toMatch(/"?Item1"?,"?100"?/)
      expect(result).toMatch(/"?Item2"?,"?200"?/)
    })

    test('should format data as YAML', async () => {
      const data = { title: 'Test Document', items: ['one', 'two'] }
      const result = await pipeline.formatAsYaml(JSON.stringify(data), {})
      
      expect(result).toContain('title: Test Document')
      expect(result).toContain('items:')
      expect(result).toContain('- one')
      expect(result).toContain('- two')
    })
  })

  describe('complex scenarios', () => {
    test('should handle dynamic target resolution', async () => {
      const config: ComposerConfig = {
        sources: {
          items: {
            pattern: path.join(testDir, '**/*.json'),
            parser: 'json'
          }
        },
        build: {
          tasks: [{
            name: 'dynamic-task',
            input: 'items',
            processor: 'dynamic-processor'
          }]
        },
        outputs: [{
          target: '{{name}}.md',
          format: 'markdown',
          processor: 'dynamic-processor'
        }]
      }

      pipeline = new BuildPipeline(config)
      
      const processor: Processor = {
        name: 'dynamic-processor',
        process: jest.fn().mockResolvedValue('Processed content')
      }
      pipeline.registerProcessor(processor)

      // Create test data
      await fs.writeFile(
        path.join(testDir, 'item1.json'),
        '{"name": "first", "value": 1}'
      )
      await fs.writeFile(
        path.join(testDir, 'item2.json'), 
        '{"name": "second", "value": 2}'
      )

      const outputs = await pipeline.execute()
      
      expect(outputs.size).toBeGreaterThan(0)
      expect(processor.process).toHaveBeenCalled()
    })

    test('should support conditional task execution', async () => {
      const config: ComposerConfig = {
        sources: {
          testData: {
            pattern: path.join(testDir, '**/*.json'),
            parser: 'json'
          }
        },
        build: {
          tasks: [{
            name: 'conditional-task',
            input: 'testData',
            processor: 'test-processor'
            // No condition means it should always run
          }]
        },
        outputs: []
      }

      pipeline = new BuildPipeline(config)
      
      const processor: Processor = {
        name: 'test-processor',
        process: jest.fn().mockResolvedValue('result')
      }
      pipeline.registerProcessor(processor)

      await fs.writeFile(
        path.join(testDir, 'data.json'),
        '{"name": "test"}'
      )

      const outputs = await pipeline.execute()
      
      // The processor should be called since there's no condition
      expect(processor.process).toHaveBeenCalled()
    })
  })
})