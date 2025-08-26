# Composer Troubleshooting Guide

## Common Issues and Solutions

### Error: Cannot read properties of undefined (reading 'split')

This error typically occurs when the configuration is too complex or has invalid patterns.

**Solution**: Start with a simple configuration:

```javascript
module.exports = {
  sources: {
    docs: {
      pattern: '*.md',
      parser: 'markdown'
    }
  },
  outputs: [
    {
      target: 'README.md',
      format: 'markdown'
    }
  ],
  options: {
    baseDir: process.cwd()
  }
}
```

### Error: Template not found

Composer can't find the specified template.

**Solution**: Use built-in templates or provide full path:

```javascript
outputs: [
  {
    target: 'README.md',
    template: 'readme',  // Built-in template
    format: 'markdown'
  }
]
```

### Error: Parser not recognized

The specified parser doesn't exist.

**Solution**: Use supported parsers:
- `markdown` - For .md files
- `yaml` - For .yaml/.yml files  
- `typescript` - For .ts files
- `javascript` - For .js files
- `json` - For .json files

### Build fails silently

The build process doesn't provide output.

**Solution**: Enable verbose mode:

```javascript
options: {
  verbose: true,
  baseDir: process.cwd()
}
```

Or via CLI:

```bash
npx @akaoio/composer build --verbose
```

### Configuration not loading

Composer can't find your config file.

**Solution**: Specify config explicitly:

```bash
npx @akaoio/composer build --config composer.config.js
```

Or name it `composer.config.js` in project root.

## Working Configuration Examples

### Minimal Working Config

```javascript
module.exports = {
  sources: {
    readme: {
      pattern: 'README.md',
      parser: 'markdown'
    }
  },
  outputs: [
    {
      target: 'dist/README.md',
      format: 'markdown'
    }
  ]
}
```

### TypeScript Project Config

```javascript
module.exports = {
  sources: {
    code: {
      pattern: 'src/**/*.ts',
      parser: 'typescript'
    }
  },
  outputs: [
    {
      target: 'API.md',
      format: 'markdown'
    }
  ],
  options: {
    baseDir: process.cwd(),
    verbose: false
  }
}
```

### Documentation Site Config

```javascript
module.exports = {
  sources: {
    docs: {
      pattern: 'docs/**/*.md',
      parser: 'markdown'
    },
    examples: {
      pattern: 'examples/**/*.js',
      parser: 'javascript'
    }
  },
  outputs: [
    {
      target: 'site/index.html',
      format: 'html'
    }
  ]
}
```

## Best Practices

1. **Start Simple**: Begin with minimal config and add complexity gradually
2. **Use Absolute Paths**: When in doubt, use absolute paths for patterns
3. **Check File Existence**: Ensure source files exist before building
4. **Validate Patterns**: Test glob patterns with `ls` command first
5. **Use Built-in Templates**: Avoid custom templates initially

## Debug Mode

Enable debug output to troubleshoot issues:

```bash
DEBUG=composer:* npx @akaoio/composer build
```

## Getting Help

If issues persist:

1. Check the [examples directory](../examples)
2. Review the [API documentation](../README.md)
3. Create a minimal reproduction case
4. Report issues at https://github.com/akaoio/composer/issues