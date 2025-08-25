import { parseContentSafely } from './parseContentSafely.js'

export async function formatAsJson(this: any, content: any, options: any = {}): Promise<string> {
  // If content is already an object/array, use it directly
  if (typeof content !== 'string') {
    return JSON.stringify(content, null, options.indent || 2)
  }
  
  // Try to extract structured data from rendered template
  // First, try to parse as JSON
  try {
    const data = JSON.parse(content)
    return JSON.stringify(data, null, options.indent || 2)
  } catch {
    // If it's not valid JSON, try to extract structure from markdown-like content
    const lines = content.split('\n').filter(line => line.trim())
    const structured: any = {}
    
    // Extract headers and their content
    let currentSection: string | null = null
    let currentList: string[] = []
    
    for (const line of lines) {
      // Headers become keys
      if (line.match(/^#{1,6}\s+/)) {
        if (currentSection && currentList.length > 0) {
          structured[currentSection] = currentList.length === 1 ? currentList[0] : currentList
          currentList = []
        }
        currentSection = line.replace(/^#{1,6}\s+/, '').trim()
        structured[currentSection] = null
      }
      // List items
      else if (line.match(/^[-*]\s+/) && currentSection) {
        const item = line.replace(/^[-*]\s+/, '').trim()
        currentList.push(item)
      }
      // Key-value pairs
      else if (line.includes(':') && currentSection) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        if (!structured[currentSection]) structured[currentSection] = {}
        if (typeof structured[currentSection] === 'object' && !Array.isArray(structured[currentSection])) {
          structured[currentSection][key.replace(/^[-*]\s+/, '').trim()] = value
        }
      }
      // Regular content
      else if (currentSection && line.trim()) {
        if (!structured[currentSection]) {
          structured[currentSection] = line
        } else if (typeof structured[currentSection] === 'string') {
          structured[currentSection] += '\n' + line
        }
      }
    }
    
    // Save last section
    if (currentSection && currentList.length > 0) {
      structured[currentSection] = currentList.length === 1 ? currentList[0] : currentList
    }
    
    // If we extracted something meaningful, use it
    if (Object.keys(structured).length > 0) {
      return JSON.stringify(structured, null, options.indent || 2)
    }
    
    // Otherwise, wrap content as-is
    return JSON.stringify({ content }, null, options.indent || 2)
  }
}