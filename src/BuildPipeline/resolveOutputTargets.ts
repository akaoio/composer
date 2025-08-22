import path from 'path'
import { Template } from '../Template/index.js'
import { promises as fs } from 'fs'

export async function resolveOutputTargets(
  this: any, 
  target: string | string[] | any, 
  result: any
): Promise<Array<{ path: string; content?: string; options?: any }>> {
  
  // Simple string target
  if (typeof target === 'string') {
    return [{ path: target }]
  }
  
  // Array of string targets
  if (Array.isArray(target) && target.every(t => typeof t === 'string')) {
    return target.map(t => ({ path: t }))
  }
  
  // Complex target configuration
  if (typeof target === 'object' && !Array.isArray(target)) {
    return await this.resolveComplexTarget(target, result)
  }
  
  // Array of mixed targets
  if (Array.isArray(target)) {
    const resolved: Array<{ path: string; content?: string; options?: any }> = []
    
    for (const t of target) {
      if (typeof t === 'string') {
        resolved.push({ path: t })
      } else if (typeof t === 'object') {
        const complexResolved = await this.resolveComplexTarget(t, result)
        resolved.push(...complexResolved)
      }
    }
    
    return resolved
  }
  
  throw new Error(`Invalid target configuration: ${JSON.stringify(target)}`)
}

async function resolveComplexTarget(
  this: any,
  targetConfig: any,
  result: any
): Promise<Array<{ path: string; content?: string; options?: any }>> {
  
  // Dynamic target generation based on data
  if (targetConfig.pattern && targetConfig.forEach) {
    return await this.generateDynamicTargets(targetConfig, result)
  }
  
  // Conditional target
  if (targetConfig.condition && targetConfig.target) {
    const shouldGenerate = await this.evaluateCondition(targetConfig.condition, result)
    if (shouldGenerate) {
      return await this.resolveOutputTargets(targetConfig.target, result)
    } else {
      return []
    }
  }
  
  // Template-based target
  if (targetConfig.template) {
    const template = new Template(targetConfig.template, result)
    const targetPath = template.render()
    return [{
      path: targetPath,
      content: targetConfig.content,
      options: targetConfig.options
    }]
  }
  
  // Direct path with options
  if (targetConfig.path) {
    return [{
      path: targetConfig.path,
      content: targetConfig.content,
      options: targetConfig.options
    }]
  }
  
  throw new Error(`Invalid complex target configuration: ${JSON.stringify(targetConfig)}`)
}

async function generateDynamicTargets(
  this: any,
  targetConfig: any,
  result: any
): Promise<Array<{ path: string; content?: string; options?: any }>> {
  
  const targets: Array<{ path: string; content?: string; options?: any }> = []
  const data = this.getDataForPattern(targetConfig.forEach, result)
  
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const context = { item, index: i, data }
      
      const pathTemplate = new Template(targetConfig.pattern, context)
      const targetPath = pathTemplate.render()
      const content = targetConfig.contentTemplate 
        ? new Template(targetConfig.contentTemplate, context).render()
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
      
      const pathTemplate = new Template(targetConfig.pattern, context)
      const targetPath = pathTemplate.render()
      const content = targetConfig.contentTemplate
        ? new Template(targetConfig.contentTemplate, context).render()
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

function getDataForPattern(this: any, pattern: string, result: any): any {
  const keys = pattern.split('.')
  let current = result
  
  for (const key of keys) {
    if (current == null) return null
    current = current[key]
  }
  
  return current
}

async function evaluateCondition(this: any, condition: string | Function, result: any): Promise<boolean> {
  if (typeof condition === 'function') {
    return await condition(result)
  }
  
  if (typeof condition === 'string') {
    // Simple property check
    const keys = condition.split('.')
    let current = result
    
    for (const key of keys) {
      if (current == null) return false
      current = current[key]
    }
    
    return !!current
  }
  
  return false
}

