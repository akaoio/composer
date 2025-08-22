import { Template, type RenderContext } from '../dist/index.js'

describe('Template', () => {
  let context: RenderContext
  let template: Template

  beforeEach(() => {
    context = {
      data: {
        title: '# Hello World',
        intro: 'This is an introduction.',
        header: {
          template: '{{title}}\n\n{{intro}}'
        }
      },
      variables: {},
      functions: {}
    }
    
    template = new Template('{{title}}', context)
  })

  describe('parseVariables', () => {
    test('should parse simple variables', () => {
      const templateStr = '{{title}}'
      const variables = template.parseVariables(templateStr)
      
      expect(variables).toHaveLength(1)
      expect(variables[0]).toEqual({
        path: ['title'],
        original: '{{title}}'
      })
    })

    test('should parse nested variables', () => {
      const templateStr = '{{header.template}}'
      const variables = template.parseVariables(templateStr)
      
      expect(variables).toHaveLength(1)
      expect(variables[0]).toEqual({
        path: ['header', 'template'],
        original: '{{header.template}}'
      })
    })

    test('should parse multiple variables', () => {
      const templateStr = '{{title}} and {{intro}}'
      const variables = template.parseVariables(templateStr)
      
      expect(variables).toHaveLength(2)
      expect(variables[0].path).toEqual(['title'])
      expect(variables[1].path).toEqual(['intro'])
    })
  })

  describe('resolveVariable', () => {
    test('should resolve simple variable', () => {
      const variable = {
        path: ['title'],
        original: '{{title}}'
      }
      
      const result = template.resolveVariable(variable)
      expect(result).toBe('# Hello World')
    })

    test('should return empty string for missing variable', () => {
      const variable = {
        path: ['missing', 'variable'],
        original: '{{missing.variable}}'
      }
      
      const result = template.resolveVariable(variable)
      expect(result).toBe('')
    })
  })

  describe('render', () => {
    test('should render simple template', () => {
      const result = template.render()
      
      expect(result).toBe('# Hello World')
    })

    test('should render multiple variables', () => {
      const complexTemplate = new Template('{{title}}\n\n{{intro}}', context)
      const result = complexTemplate.render()
      
      expect(result).toBe('# Hello World\n\nThis is an introduction.')
    })

    test('should handle missing variables gracefully', () => {
      const missingTemplate = new Template('{{missing}} - {{title}}', context)
      const result = missingTemplate.render()
      
      expect(result).toBe(' - # Hello World')
    })
  })

  describe('Function Variables Error Handling - Lines 203-207', () => {
    test('should handle function variables that execute successfully', () => {
      const contextWithFunction = {
        data: {
          title: 'Test',
          dynamicContent: () => 'Generated content'
        },
        variables: {},
        functions: {}
      }

      const template = new Template('{{title}}: {{dynamicContent}}', contextWithFunction)
      const result = template.render()

      expect(result).toBe('Test: Generated content')
    })

    test('should handle function variables that throw errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const contextWithFailingFunction = {
        data: {
          title: 'Test',
          failingFunction: () => {
            throw new Error('Function execution failed')
          }
        },
        variables: {},
        functions: {}
      }

      const template = new Template('{{title}}: {{failingFunction}}', contextWithFailingFunction)
      const result = template.render()

      // Should return empty string when function fails (line 207)
      expect(result).toBe('Test: ')
      
      // Should log warning (line 206)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error calling function failingFunction:')
      )

      consoleSpy.mockRestore()
    })

    test('should handle nested function paths that throw errors', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const contextWithNestedFailingFunction = {
        data: {
          utils: {
            formatter: {
              format: () => {
                throw new Error('Nested function error')
              }
            }
          }
        },
        variables: {},
        functions: {}
      }

      const template = new Template('Result: {{utils.formatter.format}}', contextWithNestedFailingFunction)
      const result = template.render()

      // Should return empty string when nested function fails  
      expect(result).toBe('Result: ')
      
      // Should log warning with full path
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error calling function utils.formatter.format:')
      )

      consoleSpy.mockRestore()
    })

    test('should handle functions returning non-string values', () => {
      const contextWithObjectFunction = {
        data: {
          objectFunction: () => ({ result: 'object value' }),
          numberFunction: () => 42,
          booleanFunction: () => true,
          nullFunction: () => null
        },
        variables: {},
        functions: {}
      }

      const template = new Template('Object: {{objectFunction}}, Number: {{numberFunction}}, Boolean: {{booleanFunction}}, Null: {{nullFunction}}', contextWithObjectFunction)
      const result = template.render()

      expect(result).toBe('Object: [object Object], Number: 42, Boolean: true, Null: null')
    })

    test('should handle async functions that fail synchronously', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const contextWithAsyncFailingFunction = {
        data: {
          asyncFailure: () => {
            // This throws immediately before async execution
            throw new Error('Sync error in async function')
          }
        },
        variables: {},
        functions: {}
      }

      const template = new Template('Async: {{asyncFailure}}', contextWithAsyncFailingFunction)
      const result = template.render()

      expect(result).toBe('Async: ')
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error calling function asyncFailure:')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Array Index Access - Lines 181-185', () => {
    test('should access array elements by index', () => {
      const contextWithArray = {
        data: {
          items: ['first', 'second', 'third']
        },
        variables: {},
        functions: {}
      }

      const template = new Template('Item 0: {{items.0}}, Item 2: {{items.2}}', contextWithArray)
      const result = template.render()

      expect(result).toBe('Item 0: first, Item 2: third')
    })

    test('should return empty string for out-of-bounds array access', () => {
      const contextWithArray = {
        data: {
          items: ['first', 'second']
        },
        variables: {},
        functions: {}
      }

      // Testing line 185 - return null for invalid index
      const template = new Template('Invalid: {{items.5}}', contextWithArray)
      const result = template.render()

      expect(result).toBe('Invalid: ')
    })

    test('should return empty string for negative array index', () => {
      const contextWithArray = {
        data: {
          items: ['first', 'second', 'third']
        },
        variables: {},
        functions: {}
      }

      // Testing line 185 - return null for negative index
      const template = new Template('Negative: {{items.-1}}', contextWithArray)  
      const result = template.render()

      // Negative indices now work (-1 means last element)
      expect(result).toBe('Negative: third')
    })
  })

  describe('Object Content Keys Fallback - Lines 215-221', () => {
    test('should fallback to content keys when direct property access fails', () => {
      const contextWithContentKeys = {
        data: {
          document: {
            title: 'Document Title',
            content: 'Document content',
            value: 'Document value',
            text: 'Document text',
            data: 'Document data'
          }
        },
        variables: {},
        functions: {}
      }

      // Testing line 218 - fallback to content keys
      const template = new Template('Content: {{document.content}}, Value: {{document.value}}, Text: {{document.text}}, Data: {{document.data}}', contextWithContentKeys)
      const result = template.render()

      expect(result).toBe('Content: Document content, Value: Document value, Text: Document text, Data: Document data')
    })

    test('should use first available content key', () => {
      const contextWithPartialKeys = {
        data: {
          partial: {
            value: 'Has value',
            text: 'Has text'
          }
        },
        variables: {},
        functions: {}
      }

      // Should find 'value' first in the contentKeys array
      const template = new Template('First available: {{partial}}', contextWithPartialKeys)
      const result = template.render()

      expect(result).toBe('First available: Has value')
    })
  })
})