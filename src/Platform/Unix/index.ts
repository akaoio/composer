/**
 * Unix Platform Strategy
 * Linux, macOS, FreeBSD, etc.
 */

import { NodeStrategy } from '../Node/index.js'
import type { PlatformCapabilities } from '../types.js'

export class UnixStrategy extends NodeStrategy {
    
    getName(): string {
        return `Unix (${process.platform}) ${process.arch}`
    }
    
    getCapabilities(): PlatformCapabilities {
        const base = super.getCapabilities()
        
        return {
            ...base,
            
            // Unix has full symlink support
            hasSymlinks: true,
            hasHardlinks: true,
            
            // Case sensitivity varies
            caseSensitiveFS: process.platform !== 'darwin',
            
            // Unix typically has better file watching
            hasNativeWatch: true,
            
            // Shell is always available on Unix
            hasShell: true,
        }
    }
    
    async executeCommand(command: string): Promise<string> {
        // Use sh shell for better compatibility
        const shellCommand = `/bin/sh -c "${command}"`
        return super.executeCommand(shellCommand)
    }
    
    getWatcherType(): 'chokidar' | 'fs.watch' | 'polling' {
        // Unix has reliable fs.watch, but chokidar handles edge cases
        return this.hasPackage('chokidar') ? 'chokidar' : 'fs.watch'
    }
    
    resolveTempDir(appName: string): string {
        // Use /tmp on Unix systems
        const tmpDir = process.env.TMPDIR || '/tmp'
        return `${tmpDir}/${appName}`
    }
    
}