export async function formatAsHtml(this: any, content: string, options: any = {}): Promise<string> {
  const title = options.title || 'Generated Document'
  const charset = options.charset || 'UTF-8'
  const lang = options.lang || 'en'
  
  let html = content
  
  // If content looks like markdown, convert it
  if (options.convertMarkdown && content.includes('#')) {
    html = await this.convertMarkdownToHtml(content)
  }
  
  // Wrap in full HTML document if requested
  if (options.fullDocument !== false) {
    html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="${charset}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${options.css ? `<style>${options.css}</style>` : ''}
    ${options.styles ? options.styles.map((s: string) => `<link rel="stylesheet" href="${s}">`).join('\n    ') : ''}
</head>
<body>
    ${html}
    ${options.scripts ? options.scripts.map((s: string) => `<script src="${s}"></script>`).join('\n    ') : ''}
</body>
</html>`
  }
  
  return html
}