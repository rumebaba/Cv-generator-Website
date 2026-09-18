export function stripHtml(html: string): string {
  if (!html) return '';

  // First, extract bullet points from lists and format them properly
  // Handle <ul> and <ol> with <li> items - convert to bullet points
  let processed = html
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_: string, content: string) => {
      const items = content
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, itemContent: string) => {
          const text = itemContent
            .replace(/<[^>]*>/g, '')
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, "'")
            .replace(/&nbsp;/g, ' ')
            .trim();
          return text ? `• ${text}` : '';
        })
        .split('• ')
        .filter(Boolean)
        .join('\n• ');
      return items ? `\n${items}\n` : '';
    })
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_: string, content: string) => {
      let index = 0;
      const items = content
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, itemContent: string) => {
          index++;
          const text = itemContent
            .replace(/<[^>]*>/g, '')
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, "'")
            .replace(/&nbsp;/g, ' ')
            .trim();
          return text ? `${index}. ${text}` : '';
        })
        .split(/\d+\. /)
        .filter(Boolean)
        .join('\n');
      return items ? `\n${items}\n` : '';
    });

  // Handle remaining HTML tags
  processed = processed
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return processed;
}
