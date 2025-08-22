/**
 * Windows Platform Strategy
 * Windows-specific optimizations and path handling
 */

import { NodeStrategy } from '../Node/index.js'
import type { PlatformCapabilities } from '../types.js'

export class WindowsStrategy extends NodeStrategy {
    
    getName(): string {
        return `Windows ${process.arch}`
    }
    
    getCapabilities(): PlatformCapabilities {
        const base = super.getCapabilities()
        
        return {
            ...base,
            
            // Windows limitations
            hasSymlinks: false, // Usually requires admin
            hasHardlinks: false,
            caseSensitiveFS: false,
            
            // Windows file watching can be unreliable
            hasNativeWatch: false,
            
            // Shell handling
            hasShell: Boolean(process.env.ComSpec),
        }
    }
    
    normalizePath(filePath: string): string {
        // Convert forward slashes to backslashes on Windows
        return super.normalizePath(filePath).replace(/\//g, '\\')
    }
    
    async executeCommand(command: string): Promise<string> {
        // Use cmd.exe for Windows commands
        const shellCommand = `cmd.exe /c "${command}"`
        return super.executeCommand(shellCommand)
    }
    
    getWatcherType(): 'chokidar' | 'fs.watch' | 'polling' {
        // Windows file watching is unreliable, prefer polling
        return 'polling'
    }
    
    getGlobType(): 'fast-glob' | 'glob' | 'manual' {
        // Windows path handling can be tricky with glob
        return this.hasPackage('fast-glob') ? 'fast-glob' : 'manual'
    }
    
    resolveTempDir(appName: string): string {
        const tmpDir = process.env.TEMP || process.env.TMP || 'C:\\temp'
        return `${tmpDir}\\${appName}`
    }
    
    
    protected hasCommand(cmd: string): boolean {
        try {
            const { execSync } = require('child_process')
            execSync(`where ${cmd}`, { stdio: 'ignore' })
            return true
        } catch {
            return false
        }
    }
}