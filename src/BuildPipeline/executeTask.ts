import type { TaskConfig } from '../type/config.js'

export async function executeTask(this: any, task: TaskConfig): Promise<void> {
  // Check condition if present
  if (task.condition && !task.condition(this.context)) {
    return
  }
  
  // Resolve input data
  const input = this.resolveInput(task.input)
  
  // Get processor
  const processor = this.processors.get(task.processor)
  if (!processor) {
    throw new Error(`Processor '${task.processor}' not found for task '${task.name}'`)
  }
  
  // Execute processor
  const result = await processor.process(input, task.options || {}, this.context)
  
  // Store result in context if task has a name
  if (task.name) {
    this.context.variables[task.name] = result
  }
  
  // Handle task output if specified
  if (task.output) {
    this.context.variables[`${task.name}_output`] = result
  }
}