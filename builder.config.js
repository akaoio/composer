/**
 * @akaoio/composer build configuration
 * Uses @akaoio/builder for all build operations
 */
module.exports = {
  entry: "src/index.ts",
  target: "library",
  outDir: "dist",
  formats: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "node:*",
    "fs",
    "path",
    "child_process",
    "events",
    "util",
    "stream",
    "os",
    "readline",
    "chokidar",
    "glob",
    "js-yaml"
  ],
  minify: false,
  bundle: true,
  keepNames: true,
  platform: "node",
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version || "0.2.3")
  }
}