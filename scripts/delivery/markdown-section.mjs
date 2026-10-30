export function stripHtmlComments(text) { return text.replace(/<!--[\s\S]*?-->/g, ''); }
export function extractMarkdownSection(text, heading) {
  const lines = stripHtmlComments(text).split(/\r?\n/);
  let inside = false, fenced = false; const result = [];
  for (const line of lines) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (match && match[1].length <= 2) {
      if (inside) break;
      inside = match[1] === '##' && match[2].trim() === heading;
      continue;
    }
    if (inside) result.push(line);
  }
  return result.join('\n');
}
