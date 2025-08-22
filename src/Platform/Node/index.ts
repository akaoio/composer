/**
 * Node.js Platform Strategy
 * Standard Node.js runtime without special optimizations
 */

import os from 'os'
import path from 'path'
import { promises as fs } from 'fs'
import { execSync } from 'child_process'

import type { PlatformStrategy, PlatformCapabilities, PlatformPaths } from '../types.js'

export class NodeStrategy implements PlatformStrategy {
    
    getName(): string {
        return `Node.js ${process.version} on ${os.platform()}`
    }
    
    getCapabilities(): PlatformCapabilities {
        return {
            platform: process.platform,
            runtime: 'node',
            
            // Runtime detection
            hasBun: this.hasCommand('bun'),
            hasNode: true,
            hasDeno: this.hasCommand('deno'),
            
            // File system
            hasSymlinks: process.platform !== 'win32',
            hasHardlinks: process.platform !== 'win32',
            caseSensitiveFS: process.platform !== 'win32' && process.platform !== 'darwin',
            
            // Performance
            hasNativeWatch: true,
            hasFastGlob: this.hasPackage('fast-glob'),
            
            // Permissions
            isRoot: process.getuid ? process.getuid() === 0 : false,
            canSudo: this.hasCommand('sudo'),
            hasShell: this.hasShell(),
            
            // Architecture
            arch: process.arch,
            
            // Package managers
            hasNpm: this.hasCommand('npm'),
            hasPnpm: this.hasCommand('pnpm'),
            hasYarn: this.hasCommand('yarn')
        }
    }
    
    getPaths(): PlatformPaths {
        const home = os.homedir()
        
        return {
            home,
            
            // Data directories
            userData: this.getUserDataDir(),
            appData: this.getAppDataDir(),
            documents: path.join(home, 'Documents'),
            downloads: path.join(home, 'Downloads'),
            desktop: path.join(home, 'Desktop'),
            
            // Config directories
            config: this.getConfigDir(),
            cache: this.getCacheDir(),
            temp: os.tmpdir(),
            logs: this.getLogsDir(),
            
            // System paths
            system: this.getSystemDir(),
            bin: this.getBinDir(),
            lib: this.getLibDir(),
            
            // Separators
            sep: path.sep,
            delimiter: path.delimiter
        }
    }
    
    normalizePath(filePath: string): string {
        return path.normalize(filePath)
    }
    
    isAbsolutePath(filePath: string): boolean {
        return path.isAbsolute(filePath)
    }
    
    async createDirectory(dirPath: string): Promise<void> {
        await fs.mkdir(dirPath, { 
            recursive: true,
            mode: process.platform === 'win32' ? undefined : 0o755
        })
    }
    
    resolveDataDir(appName: string): string {
        const base = this.getUserDataDir()
        return path.join(base, appName)
    }
    
    resolveConfigDir(appName: string): string {
        const base = this.getConfigDir()
        return path.join(base, appName)
    }
    
    resolveCacheDir(appName: string): string {
        const base = this.getCacheDir()
        return path.join(base, appName)
    }
    
    resolveTempDir(appName: string): string {
        return path.join(os.tmpdir(), appName)
    }
    
    getEnvVars(): Record<string, string> {
        return { ...process.env } as Record<string, string>
    }
    
    async executeCommand(command: string): Promise<string> {
        try {
            return execSync(command, { 
                encoding: 'utf-8',
                timeout: 30000
            })
        } catch (error: any) {
            throw new Error(`Command failed: ${command}\n${error.message}`)
        }
    }
    
    getWatcherType(): 'chokidar' | 'fs.watch' | 'polling' {
        // chokidar is more reliable across platforms
        return this.hasPackage('chokidar') ? 'chokidar' : 'fs.watch'
    }
    
    getGlobType(): 'fast-glob' | 'glob' | 'manual' {
        return this.hasPackage('fast-glob') ? 'fast-glob' : 'glob'
    }
    
    // Protected helper methods  
    protected hasCommand(cmd: string): boolean {
        try {
            execSync(`which ${cmd}`, { stdio: 'ignore' })
            return true
        } catch {
            return false
        }
    }
    
    protected hasPackage(pkg: string): boolean {
        try {
            require.resolve(pkg)
            return true
        } catch {
            return false
        }
    }
    
    protected hasShell(): boolean {
        return Boolean(process.env.SHELL || process.env.ComSpec)
    }
    
    private getUserDataDir(): string {
        switch (process.platform) {
            case 'win32':
                return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
            case 'darwin':
                return path.join(os.homedir(), 'Library', 'Application Support')
            default:
                return process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local', 'share')
        }
    }
    
    private getAppDataDir(): string {
        return this.getUserDataDir()
    }
    
    private getConfigDir(): string {
        switch (process.platform) {
            case 'win32':
                return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
            case 'darwin':
                return path.join(os.homedir(), 'Library', 'Preferences')
            default:
                return process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config')
        }
    }
    
    private getCacheDir(): string {
        switch (process.platform) {
            case 'win32':
                return process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
            case 'darwin':
                return path.join(os.homedir(), 'Library', 'Caches')
            default:
                return process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache')
        }
    }
    
    private getLogsDir(): string {
        switch (process.platform) {
            case 'win32':
                return path.join(this.getUserDataDir(), 'logs')
            case 'darwin':
                return path.join(os.homedir(), 'Library', 'Logs')
            default:
                return path.join(this.getUserDataDir(), 'logs')
        }
    }
    
    private getSystemDir(): string {
        switch (process.platform) {
            case 'win32':
                return process.env.SYSTEMROOT || 'C:\\Windows'
            default:
                return '/usr'
        }
    }
    
    private getBinDir(): string {
        switch (process.platform) {
            case 'win32':
                return 'C:\\Windows\\System32'
            default:
                return '/usr/bin'
        }
    }
    
    private getLibDir(): string {
        switch (process.platform) {
            case 'win32':
                return 'C:\\Windows\\System32'
            default:
                return '/usr/lib'
        }
    }
}