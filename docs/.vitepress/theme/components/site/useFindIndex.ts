import { shallowRef } from 'vue'
import { withBase } from 'vitepress'
import localSearchIndex from '@localSearchIndex'
import MiniSearch from 'minisearch'
import type { NavNode } from './useSiteNav'

/** One row of the Find window: Name · In folder · Type. */
export interface FindResult {
  id: string
  name: string
  folder: string
  type: string
  href: string
}

interface Section {
  id: string
  title: string
  titles: string[]
}

let index: MiniSearch | undefined
const ready = shallowRef(false)

/** Loads VitePress's search index once, the first time Find opens. */
export async function loadIndex(): Promise<void> {
  if (index) return
  const json = (await localSearchIndex.root?.())?.default
  if (json === undefined) return
  index = MiniSearch.loadJSON(json, {
    fields: ['title', 'titles', 'text'],
    storeFields: ['title', 'titles'],
    searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } },
  })
  ready.value = true
}

/** What kind of thing a page is, by the top folder it sits in. */
const kinds: Record<string, string> = {
  Guide: 'Guide',
  Components: 'Component',
  Patterns: 'Pattern',
  Decisions: 'Decision',
  'Foundations · Tokens': 'Foundation',
}

const folderOf = (node: NavNode) => node.path.map((folder) => folder.text).join('\\')

function flatten(nodes: NavNode[]): NavNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)])
}

function firstPage(node: NavNode): string {
  return flatten(node.children).find((child) => child.link !== undefined)?.link ?? '/'
}

/**
 * Finds pages and folders by name first, as «Find: Files and Folders» does,
 * then sections of pages by their text from VitePress's index.
 */
export function find(query: string, tree: NavNode[]): FindResult[] {
  const term = query.trim().toLowerCase()
  if (term === '') return []

  const nodes = flatten(tree)
  const byName: FindResult[] = nodes
    .filter((node) => node.text.toLowerCase().includes(term))
    // Pages before folders, and names that start with the term first.
    .sort(
      (a, b) =>
        Number(a.children.length > 0) - Number(b.children.length > 0) ||
        Number(!a.text.toLowerCase().startsWith(term)) -
          Number(!b.text.toLowerCase().startsWith(term))
    )
    .map((node) => {
      const isFolder = node.children.length > 0
      return {
        id: `name:${node.id}`,
        name: node.text,
        folder: folderOf(node),
        type: isFolder ? 'Folder' : (kinds[node.path[0]?.text ?? ''] ?? 'Page'),
        href: withBase(isFolder ? firstPage(node) : (node.link ?? '/')),
      }
    })

  const pageByPath = new Map(
    nodes.filter((node) => node.link).map((node) => [node.link?.replace(/\/$/, ''), node])
  )
  /*
   * Text matches are kept tight, as a Find window should be: every word must
   * match, short words only as prefixes (a typo allowance on «datat» matches
   * «data» everywhere), and sections far weaker than the best one dropped.
   */
  const hits =
    index?.search(query, {
      prefix: true,
      fuzzy: term.length > 5 ? 0.2 : false,
      combineWith: 'AND',
    }) ?? []
  const best = hits[0]?.score ?? 0
  const bySection: FindResult[] = hits
    .filter((hit) => hit.score >= best * 0.25)
    .map((hit) => {
      const [path = '', hash] = String(hit.id).split('#')
      const page = pageByPath.get(path.replace(/\.html$/, '').replace(/\/$/, ''))
      const section = hit as unknown as Section
      return {
        id: `text:${String(hit.id)}`,
        name: section.title,
        folder: page ? [folderOf(page), page.text].filter(Boolean).join('\\') : path,
        type: hash ? 'Section' : 'Page',
        href: withBase(String(hit.id)),
      }
    })

  const seen = new Set(byName.map((result) => result.href))
  return [...byName, ...bySection.filter((result) => !seen.has(result.href))].slice(0, 50)
}

export { ready as indexReady }
