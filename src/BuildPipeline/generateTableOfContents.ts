export async function generateTableOfContents(this: any, content: string): Promise<string> {
  const headings = content.match(/^#{1,6}\s+.+$/gm) || []
  
  if (headings.length === 0) return ''
  
  let toc = '## Table of Contents\n\n'
  
  for (const heading of headings) {
    const level = heading.match(/^#+/)?.[0].length || 1
    const text = heading.replace(/^#+\s+/, '')
    const anchor = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    const indent = '  '.repeat(Math.max(0, level - 1))
    
    toc += `${indent}- [${text}](#${anchor})\n`
  }
  
  return toc
}