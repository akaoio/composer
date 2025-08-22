export function parseContentSafely(content: any): any {
  try {
    return typeof content === 'string' ? JSON.parse(content) : content
  } catch (error) {
    // Return original content if parsing fails
    return content
  }
}