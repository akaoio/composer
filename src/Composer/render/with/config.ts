import { BuildPipeline } from '../../../BuildPipeline/index.js'
import { ConfigLoader } from '../../../ConfigLoader/index.js'

export async function config(this: any, configPath?: string): Promise<Map<string, string>> {
  // Load config
  const loader = new ConfigLoader(configPath)
  const config = await loader.loadConfig()
  
  // Use BuildPipeline for complex rendering
  const pipeline = new BuildPipeline(config)
  
  // Register any custom processors
  if (this.customProcessors) {
    for (const processor of this.customProcessors) {
      pipeline.registerProcessor(processor)
    }
  }
  
  // Execute pipeline
  return await pipeline.execute()
}