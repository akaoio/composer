/**
 * Unified Composer Config
 * Replaces all JS orchestrator scripts with pure config-driven approach
 * Uses Composer's native config system instead of separate JS files
 */

module.exports = {
  // Data sources - load from YAML atoms
  sources: {
    // Project metadata
    project: {
      pattern: 'src/doc/config/project.yaml',
      parser: 'yaml',
      namespace: 'project'
    },

    // Core development principles
    principles: {
      pattern: 'src/doc/claude/principles/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'principles',
      transform: (content, file) => ({
        ...content,
        number: content.principle_number || 1
      })
    },

    // Architecture patterns
    patterns: {
      pattern: 'src/doc/claude/patterns/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'patterns'
    },

    // Testing requirements
    testing: {
      pattern: 'src/doc/claude/testing/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'testing'
    },

    // Development workflow
    workflow: {
      pattern: 'src/doc/claude/workflow/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'workflow'
    },

    // Architecture specifications
    architecture: {
      pattern: 'src/doc/claude/architecture/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'architecture'
    },

    // Service features
    services: {
      pattern: 'src/doc/service/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'services'
    },

    // Feature atoms for README
    features: {
      pattern: 'src/doc/features/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'features'
    },

    // Templates
    templates: {
      pattern: 'src/doc/template/**/*.md',
      parser: 'markdown',
      namespace: 'templates'
    }
  },

  // Build tasks - minimal approach using existing processors
  build: {
    parallel: false,
    bail: true,
    tasks: []
  },

  // Output generation - use templates with loaded data
  outputs: [
    // Generate README.md from template
    {
      target: 'README.md',
      template: 'src/doc/template/README.md',
      format: 'markdown'
    },
    
    // Generate CLAUDE.md from template
    {
      target: 'CLAUDE.md',
      template: 'src/doc/template/CLAUDE.md',
      format: 'markdown'
    }
  ],

  // Watch configuration
  watch: {
    patterns: [
      'src/doc/**/*.yaml',
      'src/doc/**/*.md'
    ],
    ignore: ['tmp/**', 'dist/**'],
    debounce: 300,
    reload: true
  },

  // Options
  options: {
    baseDir: '.',
    cacheDir: 'tmp/cache',
    verbose: true
  }
}