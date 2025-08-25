# @akaoio/composer Examples

This directory contains **REAL, working examples** of @akaoio/composer.

## Running the Example

```bash
# From the composer root directory
npm run build         # Build composer first
node example/index.js # Run the example
```

## What the Example Demonstrates

The `index.js` example shows:

1. **Template Rendering** - Using Handlebars-compatible syntax
   - Variables: `{{name}}`
   - Nested paths: `{{author.name}}`
   - Loops: `{{#each features}}...{{/each}}`

2. **Import Resolution** - Loading and merging data from multiple files
   - `$import: ./file.yaml` syntax
   - Nested imports

3. **Multi-Format Output** - Same template, different formats
   - Markdown output
   - HTML output (with proper markdown-to-HTML conversion)
   - JSON output (structured data extraction)

4. **Data Transformation** - Custom transform functions
   - Modify data during loading
   - Add computed properties

5. **Custom Processors** - Using built-in processors
   - `data-transformer` with filter/map operations
   - `data-merger` for combining sources
   - `data-validator` for validation

## Output Files

After running, check the generated files in:
```
tmp/real-example/output/
├── README.md     # Markdown output
├── README.html   # HTML with proper tags
└── data.json     # Structured JSON
```

## Key Differences from Legacy Examples

The old examples used concepts from @ventureone that no longer exist:
- ❌ `composer.compose()` - Method doesn't exist
- ❌ `particlesPath` - Legacy from @ventureone
- ❌ `documentsPath` - Legacy from @ventureone
- ❌ `particle-loader` - Removed legacy processor
- ❌ `component-loader` - Removed legacy processor

This example uses the **real, current API**:
- ✅ `BuildPipeline` class
- ✅ Proper configuration structure
- ✅ Real template rendering
- ✅ Working import resolution
- ✅ Actual format conversion

## Creating Your Own Example

```javascript
const { BuildPipeline } = require('@akaoio/composer')

const config = {
  sources: {
    // Define your data sources
    myData: {
      pattern: 'path/to/data.yaml',
      parser: 'yaml'
    }
  },
  build: {
    tasks: [] // Optional build tasks
  },
  outputs: [
    // Define your outputs
    {
      target: 'output/file.md',
      template: 'template.md',
      format: 'markdown'
    }
  ]
}

const pipeline = new BuildPipeline(config)
const outputs = await pipeline.execute()
```

---

*All fake examples have been removed. This is the only real, working example.*