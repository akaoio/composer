import { globalHelperRegistry, type HelperFunction } from './helpers.js'

// Register a custom helper function
export function registerHelper(this: any, name: string, helper: HelperFunction): void {
  if (!this.helpers) {
    // Initialize helpers if not already done
    this.helpers = globalHelperRegistry
  }
  
  this.helpers.register(name, helper)
}