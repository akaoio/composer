/**
 * Simple Composer Configuration Example
 * Based on @akaoio/air integration
 */

module.exports = {
  // Input sources - start simple
  sources: {
    // TypeScript source files
    code: {
      pattern: 'src/**/*.ts',
      parser: 'typescript'
    },
    // Markdown documentation
    docs: {
      pattern: 'docs/**/*.md',
      parser: 'markdown'
    },
    // README file
    readme: {
      pattern: 'README.md',
      parser: 'markdown'
    }
  },

  // Build tasks - keep it simple
  build: {
    tasks: [
      {
        name: 'validate',
        run: 'validate-sources'
      }
    ]
  },

  // Single output for simplicity
  outputs: [
    {
      target: 'README.md',
      template: 'readme',
      format: 'markdown',
      data: {
        title: 'Your Project Name',
        description: 'Your project description',
        version: '1.0.0'
      }
    }
  ],

  // Minimal options
  options: {
    baseDir: process.cwd(),
    verbose: false,
    clean: false
  }
}