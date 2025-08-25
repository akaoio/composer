import type { ComposerConfig, BuildContext, Processor } from '../type/config.js'

export function constructor(this: any, config: ComposerConfig) {
  this.config = config
  
  this.context = {
    sources: {},
    data: {},
    variables: {},
    files: new Map(),
    config
  } as BuildContext
  
  this.processors = new Map<string, Processor>()
  
  // Register built-in processors
  registerBuiltinProcessors.call(this)
}

// Helper function for deep merge
function deepMerge(target: any, source: any): any {
  if (!source) return target
  if (!target) return source
  
  const result = { ...target }
  
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

function registerBuiltinProcessors(this: any) {
  // Generic data transformer - applies transformations to input data
  this.processors.set('data-transformer', {
    name: 'data-transformer',
    process: async (input: any, options: any = {}) => {
      let result = input
      
      // Apply filter if specified
      if (options.filter && typeof options.filter === 'function') {
        if (Array.isArray(result)) {
          result = result.filter(options.filter)
        } else if (typeof result === 'object') {
          result = Object.entries(result).reduce((acc, [key, value]) => {
            if (options.filter({ key, value })) {
              acc[key] = value
            }
            return acc
          }, {} as any)
        }
      }
      
      // Apply map transformation if specified
      if (options.map && typeof options.map === 'function') {
        if (Array.isArray(result)) {
          result = result.map(options.map)
        } else if (typeof result === 'object') {
          result = Object.entries(result).reduce((acc, [key, value]) => {
            acc[key] = options.map(value)
            return acc
          }, {} as any)
        }
      }
      
      // Apply reduce if specified
      if (options.reduce && typeof options.reduce === 'function') {
        if (Array.isArray(result)) {
          result = result.reduce(options.reduce, options.initialValue)
        }
      }
      
      return result
    }
  })
  
  // Generic data merger - merges multiple data sources
  this.processors.set('data-merger', {
    name: 'data-merger',
    process: async (input: any, options: any = {}) => {
      const strategy = options.strategy || 'shallow' // shallow, deep, concat
      
      if (!Array.isArray(input) && typeof input === 'object' && input.sources) {
        const sources = Object.values(input.sources)
        
        switch (strategy) {
          case 'deep':
            // Deep merge all sources
            return sources.reduce((acc, source) => deepMerge(acc, source), {})
            
          case 'concat':
            // Concatenate arrays, merge objects
            return sources.reduce((acc, source) => {
              if (Array.isArray(acc) && Array.isArray(source)) {
                return [...acc, ...source]
              }
              return { ...acc, ...source }
            }, Array.isArray(sources[0]) ? [] : {})
            
          case 'shallow':
          default:
            // Shallow merge
            return Object.assign({}, ...sources)
        }
      }
      
      return input
    }
  })
  
  // Generic data validator - validates data against schemas or rules
  this.processors.set('data-validator', {
    name: 'data-validator',
    process: async (input: any, options: any = {}) => {
      const errors: string[] = []
      
      // Validate required fields
      if (options.required && Array.isArray(options.required)) {
        for (const field of options.required) {
          if (!input[field]) {
            errors.push(`Missing required field: ${field}`)
          }
        }
      }
      
      // Validate types
      if (options.types && typeof options.types === 'object') {
        for (const [field, type] of Object.entries(options.types)) {
          if (input[field] !== undefined && typeof input[field] !== type) {
            errors.push(`Invalid type for ${field}: expected ${type}, got ${typeof input[field]}`)
          }
        }
      }
      
      // Custom validation function
      if (options.validate && typeof options.validate === 'function') {
        const customErrors = options.validate(input)
        if (customErrors) {
          errors.push(...(Array.isArray(customErrors) ? customErrors : [customErrors]))
        }
      }
      
      if (errors.length > 0 && options.throwOnError) {
        throw new Error(`Validation failed:\n${errors.join('\n')}`)
      }
      
      return {
        valid: errors.length === 0,
        errors,
        data: input
      }
    }
  })
}