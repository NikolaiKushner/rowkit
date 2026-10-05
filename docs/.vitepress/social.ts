import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { HeadConfig, PageData, TransformContext } from 'vitepress'

/**
 * Link previews: every page shares one card image — the og-image frame of the
 * Figma Brand page, 1200×630 — and gets its own title, description and URL,
 * so a link to the DataTable page reads «DataTable — rowkit» and says what
 * DataTable is, rather than repeating the home page.
 */
export const origin = 'https://rowkit.dev'
export const image = `${origin}/og-image.png`

/** Head tags every page shares. */
export const sharedHead: HeadConfig[] = [
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:site_name', content: 'rowkit' }],
  ['meta', { property: 'og:image', content: image }],
  ['meta', { property: 'og:image:width', content: '1200' }],
  ['meta', { property: 'og:image:height', content: '630' }],
  [
    'meta',
    {
      property: 'og:image:alt',
      content: 'A Windows 98 window titled rowkit, and a Command Prompt running pnpm add rowkit.',
    },
  ],
  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:image', content: image }],
]

/**
 * The first paragraph of a page's markdown, as plain text: what the page is
 * about, in the words it opens with. Front matter, headings, the «Stage» and
 * «Status» lines, code and components are skipped; markdown marks are stripped.
 */
export function firstParagraph(markdown: string, limit = 200): string | undefined {
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/```[\s\S]*?```/g, '')
  const paragraph = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(
      (block) => block !== '' && !/^(#|<|\*\*(Stage|Status|Decided)|:::|\||-|>|!\[)/.test(block)
    )
  if (paragraph === undefined) return undefined
  const text = paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= limit) return text
  return `${text.slice(0, text.lastIndexOf(' ', limit - 1))}…`
}

/** Fills a page's description from its first paragraph when it gives none. */
export function describe(pageData: PageData, srcDir: string): void {
  if (pageData.frontmatter.description !== undefined) return
  try {
    const text = firstParagraph(readFileSync(join(srcDir, pageData.relativePath), 'utf8'))
    if (text) pageData.description = text
  } catch {
    // A page with no file behind it (the 404) keeps the site's description.
  }
}

/** The page's own card: title, description and canonical URL. */
export function pageHead({ pageData, title, description }: TransformContext): HeadConfig[] {
  // The 404 has no address of its own to point a card at.
  if (pageData.isNotFound === true || pageData.relativePath === '404.md') return []
  const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  const url = `${origin}/${path}`
  return [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
  ]
}
