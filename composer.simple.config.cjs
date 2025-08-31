const path = require('path');

module.exports = {
  sources: {
    // Load package.json for metadata
    packageInfo: {
      pattern: 'package.json',
      parser: 'json'
    },
    
    // Load README for existing content
    readme: {
      pattern: 'README.md',
      parser: 'markdown'
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: 'DOCS-TEST.md',
      template: 'templates/simple-docs.md',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.',
    verbose: true
  }
}