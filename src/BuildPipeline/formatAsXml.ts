import { parseContentSafely } from './parseContentSafely.js'

export async function formatAsXml(this: any, content: any, options: any = {}): Promise<string> {
  const rootElement = options.rootElement || 'root'
  const encoding = options.encoding || 'UTF-8'
  
  let xml = `<?xml version="1.0" encoding="${encoding}"?>\n`
  
  try {
    const data = parseContentSafely(content)
    xml += await this.objectToXml(data, rootElement)
  } catch (error) {
    xml += `<${rootElement}><![CDATA[${content}]]></${rootElement}>`
  }
  
  return xml
}