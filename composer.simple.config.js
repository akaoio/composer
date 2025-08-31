module.exports = {
  sources: {
    // Load TypeScript source files
    sourceCode: {
      pattern: 'src/**/*.ts',
      parser: 'typescript',
      transform: (content, file) => {
        // Extract class, method, and documentation info
        const className = file.path.split('/').slice(-2, -1)[0]
        const methodName = path.basename(file.name, '.ts')
        
        // Extract JSDoc comments
        const jsdocMatch = content.match(/\/\*\*([\s\S]*?)\*\//g)
        const docs = jsdocMatch ? jsdocMatch[0] : ''
        
        return {
          className,
          methodName,
          filePath: file.path,
          documentation: docs,
          content: content
        }
      }
    },
    
    // Load package.json for metadata
    packageInfo: {
      pattern: 'package.json',
      parser: 'json'
    },
    
    // Load examples
    examples: {
      pattern: 'examples/*/config.js',
      parser: 'javascript',
      transform: (content, file) => {
        const exampleName = file.path.split('/').slice(-2, -1)[0]
        return {
          name: exampleName,
          path: file.path,
          config: content
        }
      }
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: 'README.md',
      template: 'templates/README.md.template',
      format: 'markdown'
    },
    {
      target: 'CLAUDE.md',
      template: 'templates/CLAUDE.md.template',
      format: 'markdown'
    },
    {
      target: 'docs/api.md',
      template: 'templates/api.md.template',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.',
    verbose: true
  }
}
