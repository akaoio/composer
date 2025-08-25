export async function convertMarkdownToHtml(this: any, markdown: string): Promise<string> {
  // Convert markdown to HTML with proper handling
  let html = markdown
  
  // Code blocks first (to protect from other replacements)
  html = html.replace(/```([^\n]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  
  // Headers (must be done before paragraphs)
  html = html.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
  
  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  
  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li>.*<\/li>\n)+/g, (match) => {
    return '<ul>\n' + match + '</ul>\n'
  })
  
  // Inline styles
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')
  
  // Paragraphs (only for lines not already wrapped in HTML tags)
  const lines = html.split('\n')
  const processedLines = []
  let inCodeBlock = false
  
  for (const line of lines) {
    if (line.includes('<pre>')) inCodeBlock = true
    if (line.includes('</pre>')) inCodeBlock = false
    
    if (!inCodeBlock && line.trim() && !line.match(/^<[^>]+>/)) {
      processedLines.push('<p>' + line + '</p>')
    } else {
      processedLines.push(line)
    }
  }
  
  return processedLines.join('\n')
}