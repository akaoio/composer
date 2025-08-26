import chokidar from 'chokidar'
import path from 'path'

export function watch(this: any, callback?: (outputs: Map<string, string>) => void): void {
  if (this.watcher) {
    this.stop()
  }
  
  const paths = [
    this.options.dataPath,
    this.options.templatesPath,
    this.options.sourcesPath,
    this.options.configPath
  ].filter(p => p)
  
  let debounceTimer: NodeJS.Timeout | null = null
  let isProcessing = false
  
  const handleChange = async (filepath: string, event: string = 'change') => {
    console.log(`File changed: ${filepath}`)
    
    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    
    // Prevent concurrent processing
    if (isProcessing) {
      debounceTimer = setTimeout(() => handleChange(filepath, event), this.options.debounceMs || 100)
      return
    }
    
    debounceTimer = setTimeout(async () => {
      if (isProcessing) return
      
      isProcessing = true
      try {
        const outputs = await this.render()
        
        if (callback) {
          callback(outputs)
        }
      } catch (error) {
        console.error('Error during rebuild:', error)
      } finally {
        isProcessing = false
        debounceTimer = null
      }
    }, this.options.debounceMs || 100)
  }
  
  // Optimized chokidar options for better reliability
  this.watcher = chokidar.watch(paths, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,  // Reduced for faster response
      pollInterval: 50          // More frequent polling
    },
    usePolling: false,          // Use native events when possible
    atomic: true,               // Handle atomic file operations better
    alwaysStat: true,          // Get file stats for better reliability
    followSymlinks: false,      // Don't follow symlinks to prevent loops
    interval: 100,             // Polling fallback interval
    binaryInterval: 300        // Binary file polling interval
  })
  
  // Enhanced event handling with better error recovery
  this.watcher
    .on('add', (filepath: string) => handleChange(filepath, 'add'))
    .on('change', (filepath: string) => handleChange(filepath, 'change'))
    .on('unlink', (filepath: string) => handleChange(filepath, 'unlink'))
    .on('error', (error: Error) => {
      console.error('Watch error:', error)
      // Attempt to recover from watch errors
      if (this.watcher) {
        try {
          this.watcher.close()
        } catch (e) {
          console.error('Error closing watcher after error:', e)
        }
        this.watcher = null
      }
    })
    .on('ready', () => {
      console.log(`Watcher ready. Watching for changes in: ${paths.join(', ')}`)
    })
  
  console.log(`Watching for changes in: ${paths.join(', ')}`)
}