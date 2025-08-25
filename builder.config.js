export default {
  entry: "src/index.ts",
  formats: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node",
  external: [
    "chokidar",
    "glob", 
    "js-yaml",
    /^@akaoio\//,
    /^node:/
  ]
}