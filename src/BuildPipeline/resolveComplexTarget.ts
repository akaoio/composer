export async function resolveComplexTarget(this: any, targetConfig: any, result: any): Promise<Array<{ path: string; content?: string; options?: any }>> {
  if (targetConfig.pattern && targetConfig.forEach) {
    return await this.generateDynamicTargets(targetConfig, result)
  }
  
  if (targetConfig.condition && targetConfig.target) {
    const shouldGenerate = await this.evaluateCondition(targetConfig.condition, result)
    if (shouldGenerate) {
      return await this.resolveOutputTargets(targetConfig.target, result)
    } else {
      return []
    }
  }
  
  if (targetConfig.template) {
    const targetPath = await this.renderTemplate(targetConfig.template, result)
    return [{
      path: targetPath,
      content: targetConfig.content,
      options: targetConfig.options
    }]
  }
  
  if (targetConfig.path) {
    return [{
      path: targetConfig.path,
      content: targetConfig.content,
      options: targetConfig.options
    }]
  }
  
  throw new Error(`Invalid complex target configuration: ${JSON.stringify(targetConfig)}`)
}