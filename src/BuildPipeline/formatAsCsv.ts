import { parseContentSafely } from './parseContentSafely.js'

export async function formatAsCsv(this: any, content: any, options: any = {}): Promise<string> {
  try {
    const data = parseContentSafely(content)
    
    if (!Array.isArray(data)) {
      throw new Error('CSV format requires array data')
    }
    
    const separator = options.separator || options.delimiter || ','
    const quote = options.quote || '"'
    const headers = options.headers || (data.length > 0 ? Object.keys(data[0]) : [])
    
    let csv = ''
    
    // Add headers
    if (options.includeHeaders !== false && headers.length > 0) {
      csv += headers.map((h: any) => `${quote}${h}${quote}`).join(separator) + '\n'
    }
    
    // Add data rows
    for (const row of data) {
      const values = headers.map((header: any) => {
        const value = row[header] || ''
        return `${quote}${String(value).replace(new RegExp(quote, 'g'), quote + quote)}${quote}`
      })
      csv += values.join(separator) + '\n'
    }
    
    return csv
  } catch (error) {
    throw new Error(`Failed to format as CSV: ${error}`)
  }
}