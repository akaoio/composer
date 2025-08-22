/**
 * Platform Detection and Abstraction for Composer
 * Cross-platform file operations, path resolution, and environment detection
 */

import { execSync } from 'child_process'
import os from 'os'
import path from 'path'
import { promises as fs } from 'fs'

import { NodeStrategy } from './Node/index.js'
import { BunStrategy } from './Bun/index.js'
import { UnixStrategy } from './Unix/index.js'
import { WindowsStrategy } from './Windows/index.js'

import type { PlatformStrategy, PlatformCapabilities, PlatformPaths } from './types.js'

export class Platform {
    private static instance: Platform | null = null
    private strategy: PlatformStrategy
    
    constructor() {
        this.strategy = this.detectAndCreateStrategy()
    }
    
    /**
     * Singleton pattern - ensures one platform strategy per process
     */
    static getInstance(): Platform {
        if (!Platform.instance) {
            Platform.instance = new Platform()
        }
        return Platform.instance
    }
    
    /**
     * Detects runtime and platform, creates appropriate strategy
     */
    private detectAndCreateStrategy(): PlatformStrategy {
        // Runtime detection first
        if (typeof globalThis !== 'undefined' && 'Bun' in globalThis) {
            return new BunStrategy()
        }
        
        // Platform detection
        const platform = process.platform
        
        switch (platform) {
            case 'win32':
                return new WindowsStrategy()
            
            case 'linux':
            case 'darwin':
            case 'freebsd':
            case 'openbsd':
            case 'sunos':
            case 'aix':
                return new UnixStrategy()
            
            default:
                console.warn(`Unknown platform: ${platform}, using Node.js strategy`)
                return new NodeStrategy()
        }
    }
    
    /**
     * Get the current platform strategy
     */
    getStrategy(): PlatformStrategy {
        return this.strategy
    }
    
    /**
     * Get platform capabilities
     */
    getCapabilities(): PlatformCapabilities {
        return this.strategy.getCapabilities()
    }
    
    /**
     * Get platform-specific paths
     */
    getPaths(): PlatformPaths {
        return this.strategy.getPaths()
    }
    
    /**
     * Get platform name
     */
    getName(): string {
        return this.strategy.getName()
    }
    
    /**
     * Detect optimal file watching strategy
     */
    getWatcherType(): 'chokidar' | 'fs.watch' | 'polling' {
        return this.strategy.getWatcherType()
    }
    
    /**
     * Get optimal glob library
     */
    getGlobType(): 'fast-glob' | 'glob' | 'manual' {
        return this.strategy.getGlobType()
    }
    
    /**
     * Resolve data directory with platform conventions
     */
    resolveDataDir(appName: string = 'composer'): string {
        return this.strategy.resolveDataDir(appName)
    }
    
    /**
     * Resolve config directory with platform conventions
     */
    resolveConfigDir(appName: string = 'composer'): string {
        return this.strategy.resolveConfigDir(appName)
    }
    
    /**
     * Resolve cache directory with platform conventions
     */
    resolveCacheDir(appName: string = 'composer'): string {
        return this.strategy.resolveCacheDir(appName)
    }
    
    /**
     * Resolve temp directory with platform conventions
     */
    resolveTempDir(appName: string = 'composer'): string {
        return this.strategy.resolveTempDir(appName)
    }
    
    /**
     * Get environment variables with platform-specific handling
     */
    getEnvVars(): Record<string, string> {
        return this.strategy.getEnvVars()
    }
    
    /**
     * Normalize file paths for platform
     */
    normalizePath(filePath: string): string {
        return this.strategy.normalizePath(filePath)
    }
    
    /**
     * Check if path is absolute
     */
    isAbsolutePath(filePath: string): boolean {
        return this.strategy.isAbsolutePath(filePath)
    }
    
    /**
     * Create directory with platform-appropriate permissions
     */
    async createDirectory(dirPath: string): Promise<void> {
        return this.strategy.createDirectory(dirPath)
    }
    
    /**
     * Execute shell command with platform handling
     */
    async executeCommand(command: string): Promise<string> {
        return this.strategy.executeCommand(command)
    }
    
    /**
     * Force a specific strategy (useful for testing)
     */
    setStrategy(strategy: PlatformStrategy): void {
        this.strategy = strategy
    }
}

// Export types
export * from './types.js'

// Export strategies for direct use if needed
export { NodeStrategy } from './Node/index.js'
export { BunStrategy } from './Bun/index.js'
export { UnixStrategy } from './Unix/index.js'
export { WindowsStrategy } from './Windows/index.js'

// Export singleton instance
export default Platform.getInstance()