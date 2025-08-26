# CLAUDE.md - @akaoio/composer

This file provides guidance to Claude AI when working with the @akaoio/composer codebase.

## Project Overview

**@akaoio/composer** - Atomic document composition engine with real-time template processing

**Version**: 0.2.4
**License**: MIT
**Author**: AKAO.IO
**Repository**: https://github.com/akaoio/composer

## Core Development Principles

### 1. Class = Directory Pattern
Each class is organized as a directory with one method per file, ensuring clear separation of concerns and maintainable code structure.

### 2. Zero Technical Debt
No TODO, FIXME, or placeholder implementations - every piece of code must be production-ready.

### 3. Test-Driven Development
Write tests before implementation, following Red-Green-Refactor cycle for all new features.

### 4. Real Implementation Only
100% authentic code with no mocks or stubs in production paths.

## Architecture Patterns

### Class = Directory + Method-per-file Pattern

Every class in this project follows the AKAO.io pattern:

```
ClassName/
  index.ts         # Class container (import & delegate only)
  constructor.ts   # Constructor implementation
  methodName.ts    # Individual method implementation
  methodName.test.ts # Method test file
```

**Example from this project:**
```
Composer/
  index.ts         # Composer class definition
  constructor.ts   # Constructor logic
  loadData.ts      # loadData() method
  render.ts        # render() method
  watch.ts         # watch() method
  stop.ts          # stop() method
```

### Naming Conventions

- **Singular forms only**: `user` not `users`
- **Single word preferred**: `save` not `saveData`
- **Directory structure for long names**: `user/profile/update.ts`
- **TypeScript imports**: Always use `.js` extension

## Project Architecture

Composer is a template processing engine that combines atomic YAML data sources with Handlebars templates to generate documentation, configuration files, and other text-based outputs.

### Core Components

**BuildPipeline**: Main orchestration class
- Responsibility: Coordinating the entire build process from data loading to output generation

**Composer**: Template processing engine
- Responsibility: Rendering templates with data sources using Handlebars syntax

**Template**: Template management system
- Responsibility: Loading and processing template files with variable substitution

**ConfigLoader**: Configuration management
- Responsibility: Loading and validating composer configuration files

**Platform**: Cross-platform utilities
- Responsibility: Handling file system operations across different operating systems

### Data Flow
```
YAML Sources → ConfigLoader → BuildPipeline → Composer → Template → Output Files
```

### Dependencies
- **Build**: @akaoio/builder (TypeScript compilation)
- **Test**: @akaoio/battle (testing framework)
- **Docs**: Self-documenting using own template engine

## Testing Requirements

**Framework**: @akaoio/battle
**Approach**: Test-Driven Development (TDD)

### Requirements
- Write test before implementation
- 100% real implementation (no mocks)
- Each method has its own test file
- Tests must pass before commit
- Integration tests for complete workflows

### Example Test
```typescript
// BuildPipeline/execute.test.ts
import { BuildPipeline } from './index.js'

export default async function test() {
  const config = {
    sources: { data: { pattern: 'test.yaml', parser: 'yaml' } },
    outputs: [{ target: 'output.md', template: 'template.md' }]
  }
  
  const pipeline = new BuildPipeline(config)
  const results = await pipeline.execute()
  
  if (!results || results.length === 0) {
    throw new Error('BuildPipeline should return results')
  }
}
```

## Development Workflow

### Before Starting
- [ ] Check existing tests
- [ ] Understand class structure
- [ ] Review CLAUDE.md

### During Development
- [ ] TDD cycle: Red → Green → Refactor
- [ ] One method per file
- [ ] 100% real implementation
- [ ] No TODO/FIXME comments

### Before Commit
- [ ] All tests pass
- [ ] No debug console.log
- [ ] Clean workspace (tmp/ for temporary files)
- [ ] Proper file structure maintained

## Project-Specific Guidelines

### Build System
- TypeScript source in `src/`
- Compiled output in `dist/`
- Multiple formats: CJS, ESM, DTS
- Use `npm run build` before testing

### Template Engine
- Variables: ``
- Array access: ``
- Supports nested paths
- Handlebars-compatible syntax

### File Organization
```
src/
  doc/           # Documentation atoms
  Composer/      # Main class
  BuildPipeline/ # Build process
  Template/      # Template engine
  ConfigLoader/  # Configuration
  Platform/      # Platform abstraction
  type/          # TypeScript types
test/            # Test files
dist/            # Compiled output
tmp/             # Temporary files (gitignored)
```

## Common Commands

```bash
npm run build    # Compile TypeScript
npm test         # Run all tests
npm run lint     # Check code style
npm run example  # Run example
```

## Anti-Patterns to Avoid

❌ **DON'T**:
- Put multiple methods in one file
- Use mocks or stubs
- Leave TODO/FIXME comments
- Create files outside proper structure
- Use plural naming
- Mix logic in index.ts files

✅ **DO**:
- One method per file
- 100% real implementation
- Complete tasks fully
- Follow directory structure
- Use singular names
- Keep index.ts as pure delegation

## Architecture Compliance

This project strictly follows:
1. **Class = Directory pattern**
2. **Zero technical debt**
3. **Clean workspace**
4. **Test-driven development**
5. **100% real implementation**

## Notes for AI Agents

When working on this codebase:
1. Always check existing patterns first
2. Follow the established structure exactly
3. Write tests before implementation
4. Keep methods small and focused
5. Use TypeScript with .js imports
6. Maintain clean architecture

## Key Implementation Rules

- **Method per file**: Each method gets its own file in the class directory
- **Index delegation**: index.ts files only import and delegate, no logic
- **Real implementation**: No placeholders, mocks, or TODOs in production code
- **Test coverage**: Every method must have a corresponding test file

---

*This documentation is generated using @akaoio/composer itself!*

*Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.*

*Generated with ❤️ by @akaoio/composer v0.2.4*