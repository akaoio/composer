import type { ComposerConfig } from '../type/config.js'

export function validateConfig(this: any, config: ComposerConfig): void {
  // Validate sources
  if (!config.sources) {
    throw new Error('Config must have sources')
  }

  if (typeof config.sources !== 'object' || Array.isArray(config.sources)) {
    throw new Error('Config sources must be an object')
  }

  for (const [name, source] of Object.entries(config.sources)) {
    if (!source.pattern) {
      throw new Error(`Source '${name}' must define a pattern`)
    }
  }

  // Validate build
  if (!config.build) {
    throw new Error('Config must have build')
  }

  if (typeof config.build !== 'object' || Array.isArray(config.build)) {
    throw new Error('Config build must be an object')
  }

  if (!Array.isArray(config.build.tasks)) {
    throw new Error('Config build.tasks must be an array')
  }

  for (const task of config.build.tasks) {
    if (!task.name) {
      throw new Error('Each task must have a name')
    }
    
    if (!task.input) {
      throw new Error(`Task '${task.name}' must define input`)
    }
    
    if (!task.processor) {
      throw new Error(`Task '${task.name}' must define a processor`)
    }
  }

  // Validate outputs
  if (!config.outputs) {
    throw new Error('Config must have outputs')
  }

  if (!Array.isArray(config.outputs)) {
    throw new Error('Config outputs must be an array')
  }

  for (const output of config.outputs) {
    if (!output.target) {
      throw new Error('Each output must define a target')
    }
    
    // Output must have either processor or template
    if (!output.processor && !output.template) {
      throw new Error('Each output must define either a processor or a template')
    }
  }
}