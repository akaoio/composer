import { formatAsJson } from './formatAsJson.js'
import { formatAsYaml } from './formatAsYaml.js'
import { formatAsMarkdown } from './formatAsMarkdown.js'
import { formatAsHtml } from './formatAsHtml.js'
import { formatAsXml } from './formatAsXml.js'
import { formatAsCsv } from './formatAsCsv.js'

export async function formatOutput(
  this: any,
  content: string,
  format: string,
  options: any = {}
): Promise<string> {
  
  switch (format) {
    case 'json':
      return await formatAsJson.call(this, content, options)
      
    case 'yaml':
    case 'yml':
      return await formatAsYaml.call(this, content, options)
      
    case 'markdown':
    case 'md':
      return await formatAsMarkdown.call(this, content, options)
      
    case 'html':
      return await formatAsHtml.call(this, content, options)
      
    case 'xml':
      return await formatAsXml.call(this, content, options)
      
    case 'csv':
      return await formatAsCsv.call(this, content, options)
      
    case 'text':
    case 'txt':
      return content
      
    default:
      // Custom format - look for processor
      const processor = this.processors.get(`${format}-formatter`)
      if (processor) {
        return await processor.process(content, options, this.context)
      }
      
      return content
  }
}