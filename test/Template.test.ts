import { Template } from '../src/Template/index.js'
import type { CompositionContext } from '../src/type/index.js'

describe('Template', () => {
  let context: CompositionContext
  let template: Template

  beforeEach(() => {
    context = {
      particles: {
        text: {
          title: {
            name: 'title',
            type: 'text',
            content: '# Hello World'
          }
        },
        concept: {
          intro: {
            name: 'intro', 
            type: 'concept',
            content: 'This is an introduction.'
          }
        }
      },
      components: {
        header: {
          name: 'header',
          particles: [],
          compose: {
            template: '{{particles.text.title.content}}\n\n{{particles.concept.intro.content}}'
          }
        }
      }
    }
    
    template = new Template(context)
  })

  describe('parseVariables', () => {
    test('should parse particle variables', () => {
      const templateStr = '{{particles.text.title.content}}'
      const variables = template.parseVariables(templateStr)
      
      expect(variables).toHaveLength(1)
      expect(variables[0]).toEqual({
        type: 'particle',
        path: ['text', 'title', 'content'],
        original: '{{particles.text.title.content}}'
      })
    })

    test('should parse component variables', () => {
      const templateStr = '{{components.header.template}}'
      const variables = template.parseVariables(templateStr)
      
      expect(variables).toHaveLength(1)
      expect(variables[0]).toEqual({
        type: 'component',
        path: ['header', 'template'],
        original: '{{components.header.template}}'
      })
    })

    test('should parse custom variables', () => {
      const templateStr = '{{custom.timestamp}}'
      const variables = template.parseVariables(templateStr)
      
      expect(variables).toHaveLength(1)
      expect(variables[0]).toEqual({
        type: 'custom',
        path: ['custom', 'timestamp'],
        original: '{{custom.timestamp}}'
      })
    })
  })

  describe('resolveVariable', () => {
    test('should resolve particle variable', () => {
      const variable = {
        type: 'particle' as const,
        path: ['text', 'title', 'content'],
        original: '{{particles.text.title.content}}'
      }
      
      const result = template.resolveVariable(variable)
      expect(result).toBe('# Hello World')
    })

    test('should return empty string for missing particle', () => {
      const variable = {
        type: 'particle' as const,
        path: ['missing', 'particle', 'content'],
        original: '{{particles.missing.particle.content}}'
      }
      
      const result = template.resolveVariable(variable)
      expect(result).toBe('')
    })
  })

  describe('render', () => {
    test('should render simple template', async () => {
      const templateStr = 'Title: {{particles.text.title.content}}'
      const result = await template.render(templateStr)
      
      expect(result).toBe('Title: # Hello World')
    })

    test('should render multiple variables', async () => {
      const templateStr = '{{particles.text.title.content}}\n\n{{particles.concept.intro.content}}'
      const result = await template.render(templateStr)
      
      expect(result).toBe('# Hello World\n\nThis is an introduction.')
    })

    test('should handle missing variables gracefully', async () => {
      const templateStr = '{{particles.missing.particle.content}} - {{particles.text.title.content}}'
      const result = await template.render(templateStr)
      
      expect(result).toBe(' - # Hello World')
    })
  })
})