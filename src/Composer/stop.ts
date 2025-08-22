export function stop(this: any): void {
  if (this.watcher) {
    this.watcher.close()
    this.watcher = null
    console.log('Stopped watching for changes')
  }
}