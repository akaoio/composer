import chokidar from 'chokidar'
import path from 'path'

export function watch(this: any, callback?: (outputs: Map<string, string>) => void): void {
  if (this.watcher) {
    this.stop()
  }
  
  const paths = [
    this.options.particlesPath,
    this.options.componentsPath,
    this.options.documentsPath
  ].filter(p => p)
  
  let debounceTimer: NodeJS.Timeout | null = null
  
  const handleChange = async (filepath: string) => {
    console.log(`File changed: ${filepath}`)
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(async () => {
      console.log('Rebuilding compositions...')
      const outputs = await this.compose()
      console.log(`Composed ${outputs.size} documents`)
      
      if (callback) {
        callback(outputs)
      }
    }, this.options.debounceMs)
  }
  
  this.watcher = chokidar.watch(paths, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    }
  })
  
  this.watcher
    .on('add', handleChange)
    .on('change', handleChange)
    .on('unlink', handleChange)
    .on('error', (error: Error) => console.error('Watch error:', error))
  
  console.log(`Watching for changes in: ${paths.join(', ')}`)
}