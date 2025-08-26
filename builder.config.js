import { glob } from 'glob'

// Get all TypeScript files in src directory
const entries = glob.sync('src/**/*.ts', {
  ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts']
})

export default {
  entry: entries,
  formats: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node",
  bundle: false,
  splitting: false,
  external: [
    "chokidar",
    "glob", 
    "js-yaml",
    /^@akaoio\//,
    /^node:/
  ]
}