# CLAUDE.md

This file provides guidance to Claude AI when working with the {{project.name}} codebase.

## Project Overview

**{{project.name}}** - {{project.description}}

**Version**: {{project.version}}
**License**: {{project.license}}
**Author**: {{project.author}}
**Repository**: {{project.repository}}

## Core Development Principles

{{#each principles}}

### {{@index}}. {{name}}

{{description}}

{{#if critical}}
**Critical**: {{critical}}
{{/if}}

{{/each}}

## Architecture Patterns


### Naming Convention

{{#each naming_convention.rules}}
- {{this}}
{{/each}}



### Class Structure Pattern

{{class_structure.pattern}}:
{{#each class_structure.rules}}
- {{this}}
{{/each}}


Example:
```
{{class_structure.example}}
```



## Project Architecture

{{project_architecture.overview}}

### Core Components

{{#each project_architecture.core_components}}
**{{name}}**: {{description}}
- Responsibility: {{responsibility}}

{{/each}}

### Data Flow
```
{{project_architecture.data_flow}}
```

### Dependencies
- **Build**: {{project_architecture.dependencies.build}}
- **Test**: {{project_architecture.dependencies.test}}
- **Docs**: {{project_architecture.dependencies.self}}

## Testing Requirements

**Framework**: {{testing.framework}}
**Approach**: {{testing.approach}}

### Requirements
{{#each testing.requirements}}
- {{this}}
{{/each}}

### Example Test
```typescript
{{testing.example}}
```

## Development Workflow

{{#each development_workflow.steps}}
{{step}}
  {{details}}

{{/each}}

### Best Practices
{{#each development_workflow.best_practices}}
- {{this}}
{{/each}}

## File Organization

```
{{file_organization}}
```

## Common Commands

```bash
{{#each commands}}
{{name}}    # {{description}}
{{/each}}
```

## Notes for AI Agents

When working on this codebase:

{{#each workflow}}
{{@index}}. **{{this}}**
{{/each}}

## Key Implementation Rules

{{#each implementation_rules}}
- **{{rule}}**: {{description}}
{{/each}}

---

*This documentation is generated using {{project.name}} itself!*

*Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.*

*Generated with ❤️ by {{project.name}} v{{project.version}}*