import { parseContentSafely } from './parseContentSafely.js'

export async function formatAsJson(this: any, content: string, options: any = {}): Promise<string> {
  try {
    const data = parseContentSafely(content)
    return JSON.stringify(data, null, options.indent || 2)
  } catch (error) {
    return JSON.stringify({ content }, null, options.indent || 2)
  }
}