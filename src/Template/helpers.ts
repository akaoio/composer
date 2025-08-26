// Helper registry and built-in helpers for Template engine
export type HelperFunction = (...args: any[]) => any

export class HelperRegistry {
  private helpers: Map<string, HelperFunction> = new Map()

  constructor() {
    // Register built-in comparison helpers
    this.registerBuiltinHelpers()
  }

  register(name: string, helper: HelperFunction): void {
    this.helpers.set(name, helper)
  }

  get(name: string): HelperFunction | undefined {
    return this.helpers.get(name)
  }

  has(name: string): boolean {
    return this.helpers.has(name)
  }

  private registerBuiltinHelpers(): void {
    // Comparison helpers
    this.register('eq', (a, b) => a === b)
    this.register('ne', (a, b) => a !== b)
    this.register('lt', (a, b) => a < b)
    this.register('gt', (a, b) => a > b)
    this.register('lte', (a, b) => a <= b)
    this.register('gte', (a, b) => a >= b)

    // Logical helpers
    this.register('and', (...args) => args.every(arg => !!arg))
    this.register('or', (...args) => args.some(arg => !!arg))
    this.register('not', (arg) => !arg)

    // Utility helpers
    this.register('length', (arr) => Array.isArray(arr) ? arr.length : 0)
    this.register('concat', (...args) => args.join(''))
    this.register('uppercase', (str) => String(str).toUpperCase())
    this.register('lowercase', (str) => String(str).toLowerCase())
    this.register('trim', (str) => String(str).trim())
  }
}

// Global helper registry instance
export const globalHelperRegistry = new HelperRegistry()