/**
 * Composer configuration for building its own documentation
 * This demonstrates the self-hosting capability of Composer
 */

module.exports = {
  // Load all documentation atoms and components
  sources: {
    // Atomic content pieces
    introAtoms: {
      pattern: 'src/doc/intro/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'intro.atoms'
    },
    featureAtoms: {
      pattern: 'src/doc/features/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'features.atoms'
    },
    usageAtoms: {
      pattern: 'src/doc/usage/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'usage.atoms'
    },
    architectureAtoms: {
      pattern: 'src/doc/architecture/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'architecture.atoms'
    },
    apiAtoms: {
      pattern: 'src/doc/api/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'api.atoms'
    },
    exampleAtoms: {
      pattern: 'src/doc/examples/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'examples.atoms'
    },
    serviceAtoms: {
      pattern: 'src/doc/service/atom/**/*.yaml',
      parser: 'yaml',
      namespace: 'service.atoms'
    },
    
    // Claude documentation atoms
    claudeAtoms: {
      pattern: 'src/doc/claude/atoms/**/*.yaml',
      parser: 'yaml',
      namespace: 'claude'
    },
    
    // Components (composed from atoms)
    components: {
      pattern: 'src/doc/component/**/*.yaml',
      parser: 'yaml',
      namespace: 'components'
    },
    
    // Project metadata
    project: {
      pattern: 'src/doc/config/project.yaml',
      parser: 'yaml',
      namespace: 'project'
    },
    
    // Templates
    templates: {
      pattern: 'src/doc/template/**/*.md',
      parser: 'markdown',
      namespace: 'templates'
    }
  },
  
  // Build tasks to compose the documentation
  build: {
    tasks: [
      {
        name: 'compose-introduction',
        input: ['intro.atoms', 'components'],
        processor: 'atom-composer',
        output: 'introduction'
      },
      {
        name: 'compose-features', 
        input: 'features.atoms',
        processor: 'list-composer',
        output: 'features'
      },
      {
        name: 'compose-api',
        input: 'api.atoms',
        processor: 'api-composer',
        output: 'api'
      },
      {
        name: 'compose-examples',
        input: 'examples.atoms',
        processor: 'example-composer',
        output: 'examples'
      },
      {
        name: 'compose-architecture',
        input: 'architecture.atoms',
        processor: 'architecture-composer',
        output: 'architecture'
      },
      {
        name: 'compose-services',
        input: 'service.atoms',
        processor: 'list-composer',
        output: 'services'
      }
    ]
  },
  
  // Generate multiple output files
  outputs: [
    {
      target: 'README.md',
      template: 'src/doc/template/README.md',
      format: 'markdown',
      data: {
        project: '{{project}}',
        introduction: '{{introduction}}',
        features: '{{features}}',
        api: '{{api}}',
        examples: '{{examples}}',
        architecture: '{{architecture}}',
        services: '{{services}}'
      }
    },
    {
      target: 'docs/getting-started.md',
      template: 'src/doc/template/getting-started.md',
      format: 'markdown'
    },
    {
      target: 'docs/api-reference.md',
      template: 'src/doc/template/api.md',
      format: 'markdown'
    },
    {
      target: 'docs/architecture.md',
      template: 'src/doc/template/architecture.md',
      format: 'markdown'
    },
    {
      target: 'CLAUDE.md',
      template: 'src/doc/claude/templates/claude.md',
      format: 'markdown',
      processor: 'template',
      data: {
        project: '{{claude.project}}',
        principles: '{{claude.principles}}',
        naming_convention: '{{claude.naming_convention}}',
        class_structure: '{{claude.class_structure}}',
        file_organization: '{{claude.file_organization}}',
        project_architecture: '{{claude.project_architecture}}',
        testing: '{{claude.testing}}',
        development_workflow: '{{claude.development_workflow}}',
        commands: '{{claude.commands}}',
        workflow: '{{claude.workflow}}',
        implementation_rules: '{{claude.implementation_rules}}'
      }
    }
  ],
  
  // Watch configuration for development
  watch: {
    patterns: ['src/doc/**/*'],
    ignore: ['node_modules/**', 'dist/**'],
    debounce: 500
  },
  
  // Options
  options: {
    baseDir: process.cwd(),
    verbose: true
  }
}