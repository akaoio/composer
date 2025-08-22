import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { Particle } from '../type/index.js'

export async function loadParticles(this: any): Promise<void> {
  const particlesPath = this.options.particlesPath
  
  if (!await fs.access(particlesPath).then(() => true).catch(() => false)) {
    console.log(`Particles directory not found: ${particlesPath}`)
    return
  }

  this.context.particles = {}
  await loadDirectory(particlesPath, this.context.particles)
}

async function loadDirectory(dirPath: string, particles: Record<string, Record<string, Particle>>) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    
    if (entry.isDirectory()) {
      await loadDirectory(fullPath, particles)
    } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
      const content = await fs.readFile(fullPath, 'utf-8')
      const particle = yaml.load(content) as Particle
      
      if (particle && particle.name) {
        const category = particle.category || particle.type || 'default'
        
        if (!particles[category]) {
          particles[category] = {}
        }
        
        particles[category][particle.name] = particle
      }
    }
  }
}