// @akaoio/composer self-documentation configuration
// This makes the composer self-documenting using its own engine
module.exports = {
  sources: {
    // Project metadata
    project: {
      pattern: 'src/doc/project.yaml',
      parser: 'yaml'
    },
    
    // Features from atomic components
    features: {
      pattern: 'src/doc/readme/atom/*.yaml',
      parser: 'yaml',
      type: 'array'
    },
    
    // Introduction content
    intro: {
      pattern: 'src/doc/intro/**/*.yaml',
      parser: 'yaml',
      type: 'array'
    },
    
    // Configuration docs
    config: {
      pattern: 'src/doc/config/**/*.yaml',
      parser: 'yaml',
      type: 'array'  
    },
    
    // API documentation
    api: {
      pattern: 'src/doc/api/**/*.yaml',
      parser: 'yaml',
      type: 'array'
    },
    
    // Usage examples
    usage: {
      pattern: 'src/doc/usage/**/*.yaml',  
      parser: 'yaml',
      type: 'array'
    },
    
    // Architecture documentation
    architecture: {
      pattern: 'src/doc/architecture/**/*.yaml',
      parser: 'yaml',
      type: 'array'
    }
  },
  
  build: {
    tasks: [],
    helpers: {
      timestamp: () => new Date().toISOString()
    }
  },
  
  outputs: [
    {
      target: 'README.md',
      template: 'templates/readme.md',
      format: 'markdown'
    }
  ]
};