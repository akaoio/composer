import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { Component } from '../type/index.js'

export async function loadComponents(this: any): Promise<void> {
  const componentsPath = this.options.componentsPath
  
  if (!await fs.access(componentsPath).then(() => true).catch(() => false)) {
    console.log(`Components directory not found: ${componentsPath}`)
    return
  }

  this.context.components = {}
  await loadDirectory(componentsPath, this.context.components)
}

async function loadDirectory(dirPath: string, components: Record<string, Component>) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    
    if (entry.isDirectory()) {
      await loadDirectory(fullPath, components)
    } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
      const content = await fs.readFile(fullPath, 'utf-8')
      const component = yaml.load(content) as Component
      
      if (component && component.name) {
        components[component.name] = component
      }
    }
  }
}