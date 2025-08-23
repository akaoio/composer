/**
 * Simple documentation config for Composer
 * Uses only built-in processors
 */

module.exports = {
  sources: {
    // Load package.json for metadata
    packageInfo: {
      pattern: 'package.json',
      parser: 'json'
    },
    
    // Load YAML configuration from docs
    project: {
      pattern: 'src/doc/config/project.yaml',
      parser: 'yaml'
    },
    
    // Load principles
    principles: {
      pattern: 'src/doc/claude/principles/atom/**/*.yaml',
      parser: 'yaml'
    },
    
    // Load patterns
    patterns: {
      pattern: 'src/doc/claude/patterns/atom/**/*.yaml',
      parser: 'yaml'
    },

    // Load README atomic pieces
    readmeAtoms: {
      pattern: 'src/doc/readme/atom/**/*.yaml',
      parser: 'yaml',
      transform: (content, file) => ({
        ...content,
        filename: file.name
      })
    },

    // Get specific title and tagline
    readmeTitle: {
      pattern: 'src/doc/readme/atom/title.yaml',
      parser: 'yaml'
    },

    readmeTagline: {
      pattern: 'src/doc/readme/atom/tagline.yaml',
      parser: 'yaml'
    },

    // Group by type for easier access
    features: {
      pattern: 'src/doc/readme/atom/features-*.yaml',
      parser: 'yaml'
    },

    installations: {
      pattern: 'src/doc/readme/atom/installation-*.yaml', 
      parser: 'yaml'
    },

    usages: {
      pattern: 'src/doc/readme/atom/usage-*.yaml',
      parser: 'yaml'
    },

    servers: {
      pattern: 'src/doc/readme/atom/server-*.yaml',
      parser: 'yaml'
    },

    contributing: {
      pattern: 'src/doc/readme/atom/contributing-*.yaml',
      parser: 'yaml'
    }
  },

  build: {
    tasks: []
  },

  outputs: [
    {
      target: 'README.md',
      template: 'src/doc/template/README.md',
      format: 'markdown'
    },
    {
      target: 'CLAUDE.md',
      template: 'src/doc/template/CLAUDE.md',
      format: 'markdown'
    }
  ],

  options: {
    baseDir: '.',
    verbose: true
  }
}