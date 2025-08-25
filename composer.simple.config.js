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
    
    // Load project metadata
    project: {
      pattern: 'src/doc/config/project.yaml',
      parser: 'yaml'
    },
    
    // Load CLAUDE.md atoms individually for proper access
    claudePrinciples: {
      pattern: 'src/doc/claude/atoms/principles.yaml',
      parser: 'yaml'
    },
    
    claudeArchitecture: {
      pattern: 'src/doc/claude/atoms/architecture.yaml',
      parser: 'yaml'
    },
    
    claudeProjectArch: {
      pattern: 'src/doc/claude/atoms/project-arch.yaml',
      parser: 'yaml'
    },
    
    claudeTesting: {
      pattern: 'src/doc/claude/atoms/testing.yaml',
      parser: 'yaml'
    },
    
    claudeWorkflow: {
      pattern: 'src/doc/claude/atoms/workflow.yaml',
      parser: 'yaml'
    },
    
    claudeCommands: {
      pattern: 'src/doc/claude/atoms/commands.yaml',
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