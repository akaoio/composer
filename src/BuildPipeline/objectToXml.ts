export async function objectToXml(this: any, obj: any, rootElement: string): Promise<string> {
  const toXml = (data: any, element: string): string => {
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return data.map(item => toXml(item, element)).join('')
      } else {
        const elements = Object.entries(data)
          .map(([key, value]) => toXml(value, key))
          .join('')
        return `<${element}>${elements}</${element}>`
      }
    } else {
      return `<${element}>${String(data)}</${element}>`
    }
  }
  
  return toXml(obj, rootElement)
}