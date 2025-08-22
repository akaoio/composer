const yaml = require('js-yaml')
import { generateTableOfContents } from './generateTableOfContents.js'

export async function formatAsMarkdown(this: any, content: string, options: any = {}): Promise<string> {
  let output = content
  
  // Add frontmatter if provided
  if (options.frontmatter) {
    const frontmatterYaml = yaml.dump(options.frontmatter)
    output = `---\n${frontmatterYaml}---\n\n${output}`
  }
  
  // Add title if provided
  if (options.title) {
    const titleLevel = '#'.repeat(options.titleLevel || 1)
    output = `${titleLevel} ${options.title}\n\n${output}`
  }
  
  // Add table of contents if requested
  if (options.toc) {
    const toc = await generateTableOfContents.call(this, output)
    output = `${toc}\n\n${output}`
  }
  
  return output
}