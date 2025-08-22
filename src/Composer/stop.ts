export function stop(this: any): void {
  if (this.watcher) {
    try {
      // Close the watcher and wait for it to finish
      this.watcher.close().then(() => {
        console.log('Stopped watching for changes')
      }).catch((error: Error) => {
        console.error('Error stopping watcher:', error)
      })
    } catch (error) {
      console.error('Error during watcher cleanup:', error)
    } finally {
      this.watcher = null
    }
  }
}