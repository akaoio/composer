import yaml from 'js-yaml'
import { parseContentSafely } from './parseContentSafely.js'

export async function formatAsYaml(this: any, content: string, options: any): Promise<string> {
  try {
    const data = parseContentSafely(content)
    return yaml.dump(data, {
      indent: options.indent || 2,
      lineWidth: options.lineWidth || -1,
      sortKeys: options.sortKeys || false
    })
  } catch (error) {
    return yaml.dump({ content }, {
      indent: options.indent || 2,
      lineWidth: options.lineWidth || -1
    })
  }
}