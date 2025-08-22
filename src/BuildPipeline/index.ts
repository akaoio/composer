import { constructor } from './constructor.js'
import { execute } from './execute.js'
import { executeTask } from './executeTask.js'
import { loadSources } from './loadSources.js'
import { processOutputs } from './processOutputs.js'
import { resolveInput } from './resolveInput.js'
import { resolveRegexPattern } from './resolveRegexPattern.js'
import { resolveOutputTargets } from './resolveOutputTargets.js'
import { formatOutput } from './formatOutput.js'
import { formatAsMarkdown } from './formatAsMarkdown.js'
import { formatAsHtml } from './formatAsHtml.js'
import { formatAsJson } from './formatAsJson.js'
import { formatAsYaml } from './formatAsYaml.js'
import { formatAsXml } from './formatAsXml.js'
import { formatAsCsv } from './formatAsCsv.js'
import { objectToXml } from './objectToXml.js'
import { resolveComplexTarget } from './resolveComplexTarget.js'
import { generateDynamicTargets } from './generateDynamicTargets.js'
import { getDataForPattern } from './getDataForPattern.js'
import { evaluateCondition } from './evaluateCondition.js'
import { convertMarkdownToHtml } from './convertMarkdownToHtml.js'
import { renderTemplate } from './renderTemplate.js'
import { walkDir } from './walkDir.js'
import type { ComposerConfig, BuildContext, Processor } from '../type/config.js'

export class BuildPipeline {
  config!: ComposerConfig
  context!: BuildContext
  processors!: Map<string, Processor>

  constructor(config: ComposerConfig) {
    constructor.call(this, config)
  }

  async execute(): Promise<Map<string, string>> {
    return execute.call(this)
  }

  async executeTask(task: any): Promise<void> {
    return executeTask.call(this, task)
  }

  async loadSources(): Promise<void> {
    return loadSources.call(this)
  }

  async processOutputs(): Promise<Map<string, string>> {
    return processOutputs.call(this)
  }

  resolveInput(input: string | string[]): any {
    return resolveInput.call(this, input)
  }

  async resolveRegexPattern(pattern: string | RegExp, baseDir: string): Promise<string[]> {
    return resolveRegexPattern.call(this, pattern, baseDir)
  }

  async resolveOutputTargets(target: any, result: any): Promise<Array<{ path: string; content?: string; options?: any }>> {
    return resolveOutputTargets.call(this, target, result)
  }

  async formatOutput(content: string, format: string, options: any = {}): Promise<string> {
    return formatOutput.call(this, content, format, options)
  }

  registerProcessor(processor: Processor): void {
    this.processors.set(processor.name, processor)
  }

  // Format helper methods - all delegated
  async formatAsMarkdown(content: any, options?: any): Promise<string> {
    return formatAsMarkdown.call(this, content, options)
  }

  async formatAsHtml(content: string, options: any = {}): Promise<string> {
    return formatAsHtml.call(this, content, options)
  }

  async formatAsJson(content: string, options: any = {}): Promise<string> {
    return formatAsJson.call(this, content, options)
  }

  async formatAsYaml(content: string, options: any): Promise<string> {
    return formatAsYaml.call(this, content, options)
  }

  async formatAsXml(content: any, options: any = {}): Promise<string> {
    return formatAsXml.call(this, content, options)
  }

  async formatAsCsv(content: any, options: any = {}): Promise<string> {
    return formatAsCsv.call(this, content, options)
  }

  async objectToXml(obj: any, rootElement: string): Promise<string> {
    return objectToXml.call(this, obj, rootElement)
  }

  // Complex target resolution methods - all delegated
  async resolveComplexTarget(targetConfig: any, result: any): Promise<Array<{ path: string; content?: string; options?: any }>> {
    return resolveComplexTarget.call(this, targetConfig, result)
  }

  async generateDynamicTargets(targetConfig: any, result: any): Promise<Array<{ path: string; content?: string; options?: any }>> {
    return generateDynamicTargets.call(this, targetConfig, result)
  }

  getDataForPattern(pattern: string, result: any): any {
    return getDataForPattern.call(this, pattern, result)
  }

  async evaluateCondition(condition: string | Function, result: any): Promise<boolean> {
    return evaluateCondition.call(this, condition, result)
  }

  async convertMarkdownToHtml(markdown: string): Promise<string> {
    return convertMarkdownToHtml.call(this, markdown)
  }

  async renderTemplate(template: string, context: any): Promise<string> {
    return renderTemplate.call(this, template, context)
  }

  async walkDir(dirPath: string, callback: (filePath: string) => void): Promise<void> {
    return walkDir.call(this, dirPath, callback)
  }
}

export default BuildPipeline