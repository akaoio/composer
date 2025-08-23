// Auto-generate README.md from data
module.exports = {
  sources: {
    examplesData: {
      pattern: 'examples.yaml',
      parser: 'yaml'
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: 'README.md',
      template: 'README.md.template',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.'
  }
}