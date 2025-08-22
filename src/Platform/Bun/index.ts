/**
 * Bun Platform Strategy  
 * Optimizations for Bun runtime environment
 */

import { NodeStrategy } from '../Node/index.js'
import type { PlatformCapabilities } from '../types.js'

export class BunStrategy extends NodeStrategy {
    
    getName(): string {
        const bunVersion = (globalThis as any).Bun?.version || 'unknown'
        return `Bun ${bunVersion} on ${process.platform}`
    }
    
    getCapabilities(): PlatformCapabilities {
        const base = super.getCapabilities()
        
        return {
            ...base,
            runtime: 'bun',
            hasBun: true,
            
            // Bun has optimized file operations
            hasNativeWatch: true,
            hasFastGlob: true, // Bun has built-in fast glob
        }
    }
    
    async executeCommand(command: string): Promise<string> {
        try {
            // Use Bun's shell execution if available
            const Bun = (globalThis as any).Bun
            if (Bun?.spawn) {
                const proc = Bun.spawn({
                    cmd: command.split(' '),
                    stdout: 'pipe',
                    stderr: 'pipe'
                })
                
                const output = await new Response(proc.stdout).text()
                const exitCode = await proc.exited
                
                if (exitCode !== 0) {
                    const error = await new Response(proc.stderr).text()
                    throw new Error(`Command failed with exit code ${exitCode}: ${error}`)
                }
                
                return output
            }
        } catch (error: any) {
            // Fall back to Node.js execution
            return super.executeCommand(command)
        }
        
        return super.executeCommand(command)
    }
    
    getWatcherType(): 'chokidar' | 'fs.watch' | 'polling' {
        // Bun has optimized fs.watch
        return 'fs.watch'
    }
    
    getGlobType(): 'fast-glob' | 'glob' | 'manual' {
        // Bun has built-in glob optimizations
        return 'fast-glob'
    }
    
    async createDirectory(dirPath: string): Promise<void> {
        try {
            // Use Bun's optimized file operations if available
            const Bun = (globalThis as any).Bun
            if (Bun?.file && Bun?.write) {
                await Bun.write(Bun.file(dirPath + '/.keep'), '')
                return
            }
        } catch {
            // Fall back to standard method
        }
        
        return super.createDirectory(dirPath)
    }
}