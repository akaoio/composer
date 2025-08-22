import { Composer } from '../dist/index.js'
import { promises as fs } from 'fs'
import path from 'path'

describe('Composer', () => {
  let composer: Composer
  let testDir: string

  beforeEach(async () => {
    testDir = path.join(process.cwd(), 'tmp', 'test-' + Date.now())
    
    composer = new Composer({
      dataPath: path.join(testDir, 'data'),
      templatesPath: path.join(testDir, 'templates'),
      outputPath: path.join(testDir, 'output')
    })

    // Create test directory structure
    await fs.mkdir(path.join(testDir, 'data'), { recursive: true })
    await fs.mkdir(path.join(testDir, 'templates'), { recursive: true })
    
    // Create test data
    await fs.writeFile(
      path.join(testDir, 'data', 'greeting.yaml'),
      `greeting: "Hello, World!"
type: "text"
`
    )
    
    // Create test template
    await fs.writeFile(
      path.join(testDir, 'templates', 'test.md'),
      `# Test Document

{{greeting.greeting}}`
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
      
      expect(defaultComposer.options.dataPath).toBe('./data')
      expect(defaultComposer.options.templatesPath).toBe('./templates')
      expect(defaultComposer.options.outputPath).toBe('./output')
      expect(defaultComposer.options.debounceMs).toBe(1000)
    })

    test('should initialize with custom options', () => {
      expect(composer.options.dataPath).toBe(path.join(testDir, 'data'))
      expect(composer.options.templatesPath).toBe(path.join(testDir, 'templates'))
      expect(composer.options.outputPath).toBe(path.join(testDir, 'output'))
    })
  })

  describe('loadData', () => {
    test('should load data from directory', async () => {
      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('greeting')
      // The data structure includes metadata, so access the greeting property correctly
      expect(composer.context.data.greeting.greeting).toBe('Hello, World!')
    })

    test('should handle missing data directory', async () => {
      const emptyComposer = new Composer({
        dataPath: path.join(testDir, 'nonexistent')
      })
      
      await expect(emptyComposer.loadData()).resolves.not.toThrow()
      expect(Object.keys(emptyComposer.context.data)).toHaveLength(0)
    })
  })

  describe('render', () => {
    test('should render templates with data', async () => {
      await composer.loadData()
      const result = await composer.render()
      
      expect(result.size).toBeGreaterThan(0)
      expect(result.has('test')).toBe(true)
    })
  })

  describe('render integration', () => {
    test('should render documents successfully', async () => {
      const outputs = await composer.render()
      
      expect(outputs.size).toBe(1)
      expect(outputs.has('test')).toBe(true)
      
      const content = outputs.get('test')!
      expect(content).toContain('# Test Document')
      expect(content).toContain('Hello, World!')
    })

    test('should write output files when outputPath is specified', async () => {
      await composer.render()
      
      const outputFile = path.join(testDir, 'output', 'test.md')
      const exists = await fs.access(outputFile).then(() => true).catch(() => false)
      expect(exists).toBe(true)
      
      const content = await fs.readFile(outputFile, 'utf-8')
      expect(content).toContain('# Test Document')
      expect(content).toContain('Hello, World!')
    })
  })

  describe('Markdown Frontmatter Parsing - Lines 102-117', () => {
    test('should parse markdown files with YAML frontmatter', async () => {
      const markdownContent = `---
title: "Frontmatter Test"
author: "Test Author"
tags: 
  - test
  - markdown
published: true
---

# Main Content

This is the main markdown content after frontmatter.
`
      await fs.writeFile(
        path.join(testDir, 'data', 'frontmatter.md'),
        markdownContent
      )

      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('frontmatter')
      const frontmatterData = composer.context.data.frontmatter
      
      // Should parse frontmatter properties (lines 104-108)
      expect(frontmatterData.title).toBe('Frontmatter Test')
      expect(frontmatterData.author).toBe('Test Author')
      expect(frontmatterData.tags).toEqual(['test', 'markdown'])
      expect(frontmatterData.published).toBe(true)
      
      // Should extract content after frontmatter (line 107)
      expect(frontmatterData.content).toBe('# Main Content\n\nThis is the main markdown content after frontmatter.')
      
      // Should include metadata
      expect(frontmatterData._meta).toBeDefined()
      expect(frontmatterData._meta.ext).toBe('.md')
    })

    test('should handle markdown files without frontmatter', async () => {
      const plainMarkdownContent = `# Plain Markdown

This markdown file has no frontmatter, just content.
`
      await fs.writeFile(
        path.join(testDir, 'data', 'plain.md'),
        plainMarkdownContent
      )

      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('plain')
      const plainData = composer.context.data.plain
      
      // Should use fallback parsing (line 110)
      expect(plainData.content).toBe('# Plain Markdown\n\nThis markdown file has no frontmatter, just content.')
      
      // Should not have frontmatter properties
      expect(plainData.title).toBeUndefined()
      expect(plainData.author).toBeUndefined()
      
      expect(plainData._meta).toBeDefined()
      expect(plainData._meta.ext).toBe('.md')
    })

    test('should handle empty frontmatter gracefully', async () => {
      const emptyFrontmatterContent = `---

---

# Empty Frontmatter

Content after empty frontmatter.
`
      await fs.writeFile(
        path.join(testDir, 'data', 'empty-frontmatter.md'),
        emptyFrontmatterContent
      )

      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('empty-frontmatter')
      const emptyFrontmatterData = composer.context.data['empty-frontmatter']
      
      // Should handle empty frontmatter (lines 104-108)
      // The content should be the body part after the frontmatter separators
      expect(emptyFrontmatterData.content).toBe('# Empty Frontmatter\n\nContent after empty frontmatter.')
      
      expect(emptyFrontmatterData._meta).toBeDefined()
    })

    test('should throw error on invalid YAML frontmatter - testing line 104 error path', async () => {
      const invalidYamlContent = `---
invalid yaml: - - -
broken: [unclosed array
---

# Content after invalid YAML

This should still work.
`
      await fs.writeFile(
        path.join(testDir, 'data', 'invalid-yaml.md'),
        invalidYamlContent
      )

      // The current implementation doesn't handle YAML parsing errors gracefully
      // Line 104 will throw when js-yaml fails to parse invalid YAML
      await expect(composer.loadData()).rejects.toThrow()
    })

    test('should handle frontmatter with complex nested objects', async () => {
      const complexFrontmatterContent = `---
title: "Complex Frontmatter"
meta:
  description: "A complex example"
  keywords: ["seo", "meta", "tags"]
  social:
    twitter: "@example"
    facebook: "example"
config:
  feature_flags:
    - name: "feature_a"
      enabled: true
    - name: "feature_b" 
      enabled: false
---

# Complex Example

Content with complex frontmatter structure.
`
      await fs.writeFile(
        path.join(testDir, 'data', 'complex.md'),
        complexFrontmatterContent
      )

      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('complex')
      const complexData = composer.context.data.complex
      
      // Should parse nested objects correctly (lines 105-106)
      expect(complexData.title).toBe('Complex Frontmatter')
      expect(complexData.meta.description).toBe('A complex example')
      expect(complexData.meta.keywords).toEqual(['seo', 'meta', 'tags'])
      expect(complexData.meta.social.twitter).toBe('@example')
      expect(complexData.config.feature_flags).toHaveLength(2)
      expect(complexData.config.feature_flags[0].name).toBe('feature_a')
      expect(complexData.config.feature_flags[0].enabled).toBe(true)
      
      expect(complexData.content).toBe('# Complex Example\n\nContent with complex frontmatter structure.')
    })

    test('should handle frontmatter that is not an object', async () => {
      const nonObjectFrontmatterContent = `---
"This is a string frontmatter"
---

# String Frontmatter Test

Content after string frontmatter.
`
      await fs.writeFile(
        path.join(testDir, 'data', 'string-frontmatter.md'),
        nonObjectFrontmatterContent
      )

      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('string-frontmatter')
      const stringFrontmatterData = composer.context.data['string-frontmatter']
      
      // Should handle non-object frontmatter (line 106 - typeof check)
      expect(stringFrontmatterData.content).toBe('# String Frontmatter Test\n\nContent after string frontmatter.')
    })

    test('should handle markdown with multiple --- separators', async () => {
      const multiSeparatorContent = `---
title: "Multi Separator Test"
---

# Content Section

---

This content has multiple --- separators but only the first should be treated as frontmatter.

---
`
      await fs.writeFile(
        path.join(testDir, 'data', 'multi-separator.md'),
        multiSeparatorContent
      )

      await composer.loadData()
      
      expect(composer.context.data).toHaveProperty('multi-separator')
      const multiSeparatorData = composer.context.data['multi-separator']
      
      expect(multiSeparatorData.title).toBe('Multi Separator Test')
      expect(multiSeparatorData.content).toBe('# Content Section\n\n---\n\nThis content has multiple --- separators but only the first should be treated as frontmatter.\n\n---')
    })
  })
})