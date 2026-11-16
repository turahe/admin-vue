const ALLOWED = new Set([
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'a',
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'hr',
  'span',
  'div',
  'iframe',
])

function isSafeUrl(value: string): boolean {
  return !/^\s*javascript:/i.test(value)
}

function isYoutube(value: string): boolean {
  return /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\//.test(value)
}

function clean(node: Node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue
    const element = child as Element
    const tag = element.tagName.toLowerCase()
    if (!ALLOWED.has(tag)) {
      element.replaceWith(...element.childNodes)
      continue
    }
    for (const attr of [...element.attributes]) {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on') || name === 'style') element.removeAttribute(attr.name)
      if ((name === 'href' || name === 'src') && !isSafeUrl(attr.value)) {
        element.removeAttribute(attr.name)
      }
    }
    if (tag === 'a') {
      element.setAttribute('rel', 'noopener noreferrer')
    }
    if (tag === 'iframe') {
      const src = element.getAttribute('src') ?? ''
      if (!isYoutube(src)) {
        element.remove()
        continue
      }
    }
    clean(element)
  }
}

export function sanitizeHtml(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html')
  clean(document.body)
  return document.body.innerHTML
}
