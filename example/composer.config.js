export default {
  // Source definitions with flexible patterns
  sources: {
    particles: {
      pattern: 'particles/**/*.{yaml,yml}',
      parser: 'yaml',
      namespace: 'particles'
    },
    content: {
      pattern: 'content/**/*.md',
      parser: 'markdown',
      transform: (content, file) => ({
        title: file.name.replace(/-/g, ' '),
        content: content.content,
        source: file.path
      })
    },
    data: {
      pattern: 'data/**/*.json',
      parser: 'json'
    }
  },

  // Build pipeline with custom tasks
  build: {
    tasks: [
      {
        name: 'load-particles',
        input: 'particles',
        processor: 'particle-loader'
      },
      {
        name: 'process-content',
        input: 'content',
        processor: 'content-processor'
      },
      {
        name: 'generate-docs',
        input: ['particles', 'content', 'data'],
        processor: 'doc-generator',
        options: {
          template: 'template.md',
          includeMetadata: true
        }
      }
    ]
  },

  // Multiple output formats
  outputs: [
    {
      target: 'dist/README.md',
      format: 'markdown',
      processor: 'markdown-renderer'
    },
    {
      target: 'dist/content.json',
      format: 'json', 
      processor: 'json-bundler'
    },
    {
      target: 'dist/index.html',
      format: 'html',
      processor: 'html-generator',
      options: {
        template: 'layout.html',
        title: 'Generated Documentation'
      }
    }
  ],

  // Watch configuration
  watch: {
    patterns: ['particles/**/*', 'content/**/*', 'data/**/*'],
    ignore: ['dist/**', 'node_modules/**'],
    debounce: 500
  },

  options: {
    verbose: true,
    cacheDir: 'tmp/cache'
  }
}