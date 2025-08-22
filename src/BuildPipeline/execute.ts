export async function execute(this: any): Promise<Map<string, string>> {
  console.log('🏗️ Starting build pipeline...')
  
  // Load all sources first
  await this.loadSources()
  
  // Execute build tasks
  for (const task of this.config.build.tasks) {
    await this.executeTask(task)
  }
  
  // Process outputs
  console.log('📦 Processing outputs...')
  const outputs = await this.processOutputs()
  
  console.log(`✅ Build completed. Generated ${outputs.size} outputs.`)
  return outputs
}