# CLAUDE.md

This file provides guidance to Claude AI when working with the {{project.name}} codebase.

## Project Overview

{{project.name}} - {{project.description}}

**Version**: {{project.version}}
**License**: {{project.license}}

## Core Development Principles

{{#principles}}
### {{number}}. {{title}}

{{content}}

{{/principles}}

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

## Naming Conventions

- **Singular forms only**: `user` not `users`
- **Single word preferred**: `save` not `saveData`
- **Directory structure for long names**: `user/profile/update.ts`
- **TypeScript imports**: Always use `.js` extension

## Testing Requirements

### Test-Driven Development (TDD)

1. **Write test first** - Define expected behavior
2. **Red phase** - Test fails
3. **Green phase** - Minimal code to pass
4. **Refactor** - Clean code while keeping tests green

### Test Structure

```
src/
  Composer/
    render.ts        # Implementation
    render.test.ts   # Test in same directory
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
- Variables: `{{path.to.value}}`
- Array access: `{{items[0]}}`
- Supports nested paths

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

---

*This document is generated using Composer itself - see `src/doc/claude/` for source.*