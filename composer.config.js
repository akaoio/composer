const path = require('path')

module.exports = {
  sources: {
    // Project metadata
    project: {
      pattern: 'src/doc/config/project.yaml',
      parser: 'yaml'
    },
    
    // README atoms
    readmeTitle: {
      pattern: 'src/doc/readme/atom/title.yaml',
      parser: 'yaml'
    },
    readmeTagline: {
      pattern: 'src/doc/readme/atom/tagline.yaml',
      parser: 'yaml'
    },
    
    // Features
    features: {
      pattern: 'src/doc/features/atom/*.yaml',
      parser: 'yaml'
    },
    
    // Installation methods
    installations: {
      pattern: 'src/doc/readme/atom/installation-*.yaml',
      parser: 'yaml'
    },
    
    // Usage examples
    usages: {
      pattern: 'src/doc/readme/atom/usage-*.yaml',
      parser: 'yaml'
    },
    
    // Server deployment
    servers: {
      pattern: 'src/doc/readme/atom/server-*.yaml',
      parser: 'yaml'
    },
    
    // Contributing
    contributing: {
      pattern: 'src/doc/readme/atom/contributing-*.yaml',
      parser: 'yaml'
    },
    
    // CLAUDE.md atoms - use the pre-structured atom files
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
  ]
}