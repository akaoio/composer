/**
 * Platform abstraction types for Composer
 * Cross-platform compatibility interfaces
 */

/**
 * Platform capabilities detection
 */
export interface PlatformCapabilities {
    platform: NodeJS.Platform
    runtime: 'bun' | 'node' | 'deno'
    
    // Runtime features
    hasBun: boolean
    hasNode: boolean
    hasDeno: boolean
    
    // File system features
    hasSymlinks: boolean
    hasHardlinks: boolean
    caseSensitiveFS: boolean
    
    // Performance features
    hasNativeWatch: boolean
    hasFastGlob: boolean
    
    // Permissions
    isRoot: boolean
    canSudo: boolean
    hasShell: boolean
    
    // Architecture
    arch: string
    
    // Package managers
    hasNpm: boolean
    hasPnpm: boolean
    hasYarn: boolean
}

/**
 * Platform-specific paths following OS conventions
 */
export interface PlatformPaths {
    // User directories
    home: string
    
    // Data directories
    userData: string      // User-specific app data
    appData: string       // Application data  
    documents: string     // User documents
    downloads: string     // User downloads
    desktop: string       // User desktop
    
    // Config directories  
    config: string        // App config
    cache: string         // App cache
    temp: string          // Temp files
    logs: string          // Log files
    
    // System paths
    system: string        // System directory
    bin: string           // Executables
    lib: string           // Libraries
    
    // Separators
    sep: string           // Path separator
    delimiter: string     // PATH delimiter
}

/**
 * Main strategy interface for platform operations
 */
export interface PlatformStrategy {
    // Platform identification
    getName(): string
    getCapabilities(): PlatformCapabilities
    getPaths(): PlatformPaths
    
    // File system operations
    normalizePath(filePath: string): string
    isAbsolutePath(filePath: string): boolean
    createDirectory(dirPath: string): Promise<void>
    
    // Directory resolution with platform conventions
    resolveDataDir(appName: string): string
    resolveConfigDir(appName: string): string
    resolveCacheDir(appName: string): string
    resolveTempDir(appName: string): string
    
    // Environment handling
    getEnvVars(): Record<string, string>
    
    // Command execution
    executeCommand(command: string): Promise<string>
    
    // Performance optimizations
    getWatcherType(): 'chokidar' | 'fs.watch' | 'polling'
    getGlobType(): 'fast-glob' | 'glob' | 'manual'
}