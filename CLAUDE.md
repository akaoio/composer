# CLAUDE.md

This file provides guidance to Claude AI when working with the @akaoio/composer codebase.

## Project Overview

**@akaoio/composer** - A powerful build system and content pipeline for generating documentation from multiple data sources

**Version**: 0.2.3
**License**: MIT
**Author**: AKAO Team
**Repository**: https://github.com/akaoio/composer

## Core Development Principles


### Zero Technical Debt

Complete every task fully before moving on - no TODO, FIXME, or placeholder code allowed.


**Critical**: true



### 100% Real Implementation

No mocks, stubs, or fake code - every implementation must be production-ready.


**Critical**: true



### Clean Workspace

All temporary files must be in tmp/, keep the workspace pristine and organized.


**Critical**: true



### Class = Directory + Method-per-file

Every class must be a directory with each method in a separate file, following the AKAO.io pattern for maximum reusability and maintainability.


**Critical**: true




## Architecture Patterns

### Naming Convention


- Use singular forms and single words

- User not Users

- get not getUser

- save not saveData

- Long names split into directories

- user/profile/update.ts not updateUserProfile.ts


### Class Structure Pattern

Classes act as containers that import and delegate to method files:

- index.ts contains only class definition and delegation

- Each method lives in its own file with full logic

- Constructor logic in constructor.ts


Example:
```
Composer/
  index.ts         # Class container
  constructor.ts   # Constructor logic
  loadData.ts      # loadData() method
  render.ts        # render() method

```

## Project Architecture

Composer follows a modular, class-as-directory architecture

### Core Components


**BuildPipeline**: Main orchestrator for the build process
- Responsibility: Loads sources, processes tasks, generates outputs


**Template**: Handlebars-based template engine
- Responsibility: Variable resolution, loops, conditionals


**ConfigLoader**: Configuration management
- Responsibility: Loads and validates composer.config.js files


**ImportResolver**: Import chain resolution
- Responsibility: Handles YAML/JSON imports and circular dependencies


**Composer**: Main API class
- Responsibility: Public interface for programmatic usage



### Data Flow
```
1. ConfigLoader reads composer.config.js
2. BuildPipeline loads sources (YAML/JSON/Markdown)
3. ImportResolver handles any imports in files
4. Template processes variables and loops
5. BuildPipeline generates outputs in specified formats
6. Files written to disk

```

### Dependencies
- **Build**: @akaoio/builder
- **Test**: @akaoio/battle
- **Docs**: @akaoio/composer (self-hosted docs!)

## Testing Requirements

**Framework**: @akaoio/battle
**Approach**: Test-Driven Development (TDD)

### Requirements

- All code must be tested with @akaoio/battle

- No Jest, Vitest, or external test frameworks

- Real PTY testing for CLI applications

- Write tests BEFORE implementation

- Tests must use actual file I/O, no mocks


### Example Test
```typescript
import { Battle } from "@akaoio/battle"

const battle = new Battle({
  command: 'composer',
  args: ['build'],
  timeout: 30000
})

await battle.spawn()
await battle.expect('Build complete')
battle.cleanup()

```

## Development Workflow


1. Create atomic documentation
  Break content into small YAML/JSON atoms


2. Design templates
  Create Handlebars templates that compose atoms


3. Configure outputs
  Define target files and formats in composer.config.js


4. Test with @akaoio/battle
  Write PTY tests for all functionality


5. Build with @akaoio/builder
  Compile TypeScript to multiple formats


6. Generate docs
  Run composer to generate all documentation



### Best Practices

- Keep atoms small and focused (single responsibility)

- Use namespaces to organize related atoms

- Template variables use  syntax

- Loops: 

- Conditionals: 

- All paths in config should be relative to project root


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

npm run build    # Compile TypeScript with @akaoio/builder

npm test    # Run all tests with @akaoio/battle

npm run lint    # Check code style

npm run dev    # Development mode with watch

npm run docs:build    # Generate documentation with @akaoio/composer (self-hosted!)

```

## Notes for AI Agents

When working on this codebase:


- **Always check existing patterns first**

- **Follow the established structure exactly**

- **Write tests before implementation (TDD)**

- **Keep methods small and focused**

- **Use proper naming conventions**

- **Maintain clean architecture**

- **Complete tasks fully (Zero Technical Debt)**

- **Keep workspace clean (tmp/ for temporary files)**


## Key Implementation Rules


- **Class = Directory + Method-per-file**: Every class is a directory with method files

- **100% Real Implementation**: No mocks, stubs, or placeholders

- **Test-Driven Development**: Write tests first, then implementation

- **Zero Technical Debt**: Complete every task fully before moving on

- **Clean Workspace**: All temporary files in tmp/, keep project root clean


---

*This documentation is generated using @akaoio/composer itself!*

*Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.*

*Generated with ❤️ by @akaoio/composer v0.2.3*