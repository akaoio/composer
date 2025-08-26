export async function generateDynamicTargets(this: any, targetConfig: any, result: any): Promise<Array<{ path: string; content?: string; options?: any; context?: any }>> {
  const targets: Array<{ path: string; content?: string; options?: any }> = []
  const data = this.getDataForPattern(targetConfig.forEach, result)
  
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const context = { item, index: i, data, ...item }
      
      const targetPath = await this.renderTemplate(targetConfig.pattern, context)
      const content = targetConfig.contentTemplate 
        ? await this.renderTemplate(targetConfig.contentTemplate, context)
        : undefined
      
      targets.push({
        path: targetPath,
        content,
        options: targetConfig.options
      })
    }
  } else if (typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      const context = { key, value, data }
      
      const targetPath = await this.renderTemplate(targetConfig.pattern, context)
      const content = targetConfig.contentTemplate
        ? await this.renderTemplate(targetConfig.contentTemplate, context)
        : undefined
      
      targets.push({
        path: targetPath,
        content,
        options: targetConfig.options
      })
    }
  }
  
  return targets
}