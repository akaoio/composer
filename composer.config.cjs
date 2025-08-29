// @akaoio/composer configuration
module.exports = {
  sources: {
    docs: {
      pattern: 'src/doc/**/*.yaml',
      parser: 'yaml'
    }
  },
  build: {
    tasks: []
  },
  outputs: [
    {
      target: 'README.md',
      template: 'templates/readme.md',
      data: 'docs'
    }
  ],
  options: {
    baseDir: process.cwd()
  }
}
