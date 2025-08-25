# CLAUDE.md

This file provides guidance to Claude AI when working with the {{project.name}} codebase.

## Project Overview

**{{project.name}}** - {{project.description}}

**Version**: {{project.version}}
**License**: {{project.license}}
**Author**: {{project.author}}
**Repository**: {{project.repository}}

## Core Development Principles

{{#each claudePrinciples.principles}}
### {{name}}

{{description}}

{{#if critical}}
**Critical**: {{critical}}
{{/if}}

{{/each}}

## Architecture Patterns

### Naming Convention

{{#each claudeArchitecture.naming_convention.rules}}
- {{this}}
{{/each}}

### Class Structure Pattern

{{claudeArchitecture.class_structure.pattern}}:
{{#each claudeArchitecture.class_structure.rules}}
- {{this}}
{{/each}}

Example:
```
{{claudeArchitecture.class_structure.example}}
```

## Project Architecture

{{claudeProjectArch.project_architecture.overview}}

### Core Components

{{#each claudeProjectArch.project_architecture.core_components}}
**{{name}}**: {{description}}
- Responsibility: {{responsibility}}

{{/each}}

### Data Flow
```
{{claudeProjectArch.project_architecture.data_flow}}
```

### Dependencies
- **Build**: {{claudeProjectArch.project_architecture.dependencies.build}}
- **Test**: {{claudeProjectArch.project_architecture.dependencies.test}}
- **Docs**: {{claudeProjectArch.project_architecture.dependencies.self}}

## Testing Requirements

**Framework**: {{claudeTesting.testing.framework}}
**Approach**: {{claudeTesting.testing.approach}}

### Requirements
{{#each claudeTesting.testing.requirements}}
- {{this}}
{{/each}}

### Example Test
```typescript
{{claudeTesting.testing.example}}
```

## Development Workflow

{{#each claudeWorkflow.development_workflow.steps}}
{{step}}
  {{details}}

{{/each}}

### Best Practices
{{#each claudeWorkflow.development_workflow.best_practices}}
- {{this}}
{{/each}}

## File Organization

```
{{claudeArchitecture.file_organization}}
```

## Common Commands

```bash
{{#each claudeCommands.commands}}
{{name}}    # {{description}}
{{/each}}
```

## Notes for AI Agents

When working on this codebase:

{{#each claudeCommands.workflow}}
- **{{this}}**
{{/each}}

## Key Implementation Rules

{{#each claudeCommands.implementation_rules}}
- **{{rule}}**: {{description}}
{{/each}}

---

*This documentation is generated using {{project.name}} itself!*

*Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.*

*Generated with ❤️ by {{project.name}} v{{project.version}}*