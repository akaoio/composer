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
### {{number}}. {{title}}

{{content}}

{{#if critical}}
**Critical**: {{critical}}
{{/if}}

{{/each}}

## Architecture Patterns

{{#each patterns}}
### {{title}}

{{content}}

{{#if example}}
Example:
```
{{example}}
```
{{/if}}

{{/each}}

## Project Architecture

{{architecture.content}}

## Testing Requirements

{{#each testing}}
### {{title}}

{{content}}

{{#if importance}}
**Importance**: {{importance}}
{{/if}}

{{#if example}}
Example:
```
{{example}}
```
{{/if}}

{{/each}}

## Development Workflow

{{#each workflow}}
### {{title}}

{{content}}

{{/each}}

## File Organization

```
src/
  BuildPipeline/
    index.ts         # Class definition
    constructor.ts   # Constructor
    execute.ts       # execute() method
    loadSources.ts   # loadSources() method
  Composer/
    index.ts
    constructor.ts
    render.ts
    watch.ts
  Template/
    index.ts
    constructor.ts
    render.ts
    parseVariables.ts
    resolveVariable.ts
    renderWithLoops.ts  # Loop processing
```

## Common Commands

```bash
npm run build    # Compile TypeScript
npm test         # Run all tests
npm run lint     # Check code style
npm run dev      # Development mode
npm run docs:build  # Generate documentation
```

## Notes for AI Agents

When working on this codebase:

1. **Always check existing patterns first**
2. **Follow the established structure exactly**
3. **Write tests before implementation (TDD)**
4. **Keep methods small and focused**
5. **Use proper naming conventions**
6. **Maintain clean architecture**
7. **Complete tasks fully (Zero Technical Debt)**
8. **Keep workspace clean (tmp/ for temporary files)**

## Key Implementation Rules

- **Class = Directory + Method-per-file**: Every class is a directory with method files
- **100% Real Implementation**: No mocks, stubs, or placeholders
- **Test-Driven Development**: Write tests first, then implementation
- **Zero Technical Debt**: Complete every task fully before moving on
- **Clean Workspace**: All temporary files in tmp/, keep project root clean

---

*This documentation is generated using {{project.name}} itself!*

*Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.*

*Generated with ❤️ by {{project.name}} v{{project.version}}*