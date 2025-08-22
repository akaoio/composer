# CLAUDE.md

This file provides guidance to Claude AI when working with the {{project.name}} codebase.

## Project Overview

**{{project.name}}** - {{project.description}}

**Version**: {{project.version}}
**License**: {{project.license}}

## Core Development Principles

{{#each principles}}
### {{number}}. {{title}}

{{content}}

{{#if importance}}
**Importance**: {{importance}}
{{/if}}

{{#if examples}}
#### Examples:
{{#each examples}}
```{{language}}
{{code}}
```
{{/each}}
{{/if}}

{{#if antiPatterns}}
#### Anti-Patterns to Avoid:
{{#list antiPatterns}}
{{/if}}

{{/each}}

## Architecture Patterns

{{#each patterns}}
### {{title}}

{{description}}

{{#if structure}}
#### Structure:
```
{{structure}}
```
{{/if}}

{{#if benefits}}
#### Benefits:
{{#list benefits}}
{{/if}}

{{#if usage}}
#### Usage:
{{usage}}
{{/if}}

{{/each}}

## Project Architecture

{{#each architecture}}
### {{title}}

{{description}}

{{#if details}}
{{#list details}}
{{/if}}

{{/each}}

## Testing Requirements

{{#each testing}}
### {{title}}

{{description}}

{{#if importance}}
**Importance**: {{importance}}
{{/if}}

{{#if example}}
#### Example:
```javascript
{{example}}
```
{{/if}}

{{/each}}

## Development Workflow

{{#each workflow}}
### {{title}}

{{#each steps}}
{{@index}}. {{this}}
{{/each}}

{{#if checklist}}
#### Checklist:
{{#list checklist}}
{{/if}}

{{/each}}

## Code Examples

{{#each examples}}
### {{title}}

{{description}}

```{{language}}
{{code}}
```

{{/each}}

## File Organization

```
{{fileStructure.src.structure}}
```

{{fileStructure.src.description}}

## Anti-Patterns to Avoid

{{#each antiPatterns}}
### ❌ {{title}}

**Wrong:**
```javascript
{{wrong}}
```

**Right:**
```javascript
{{right}}
```

**Reason:** {{reason}}

{{/each}}

## Common Commands

```bash
npm run build    # Compile TypeScript
npm test         # Run all tests
npm run lint     # Check code style
npm run dev      # Development mode
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