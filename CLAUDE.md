# CLAUDE.md

This file provides guidance to Claude AI when working with the @akaoio/composer codebase.

## Project Overview

**@akaoio/composer** - A powerful build system and content pipeline for generating documentation from multiple data sources

**Version**: 0.2.1
**License**: MIT
**Author**: AKAO Team
**Repository**: https://github.com/akaoio/composer

## Core Development Principles


### . Zero Technical Debt

Complete every task fully before moving on - no TODO, FIXME, or placeholder code allowed.


**Critical**: true



### . 100% Real Implementation

No mocks, stubs, or fake code - every implementation must be production-ready.


**Critical**: true



### . Clean Workspace

All temporary files must be in tmp/, keep the workspace pristine and organized.


**Critical**: true



### . Class = Directory + Method-per-file

Every class must be a directory with each method in a separate file, following the AKAO.io pattern for maximum reusability and maintainability.


**Critical**: true




## Architecture Patterns


### Naming Convention

Use singular forms and single words:
- User not Users
- get not getUser
- save not saveData
Long names split into directories:
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



## Testing Requirements



## Development Workflow



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

*This documentation is generated using @akaoio/composer itself!*

*Check out the `src/doc/` directory to see how we use atomic documentation pieces to build comprehensive docs.*

*Generated with ❤️ by @akaoio/composer v0.2.1*