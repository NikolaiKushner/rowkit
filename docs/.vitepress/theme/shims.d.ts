/*
 * Stylesheets imported for their effect alone — the fonts, the tokens. Vite
 * handles them; TypeScript only needs to know they are modules.
 */
declare module '*.css'

/** VitePress's local search index: per locale, a loader for the MiniSearch JSON. */
declare module '@localSearchIndex' {
  const data: Record<string, (() => Promise<{ default: string }>) | undefined>
  export default data
}

/*
 * MiniSearch, as the Find window uses it. The package is VitePress's copy,
 * reached through a Vite alias that TypeScript cannot see, so the little of
 * its API in use is declared here.
 */
declare module 'minisearch' {
  export interface SearchResult {
    id: unknown
    score: number
    [field: string]: unknown
  }

  export default class MiniSearch {
    static loadJSON(
      json: string,
      options: {
        fields: string[]
        storeFields?: string[]
        searchOptions?: {
          fuzzy?: number
          prefix?: boolean
          boost?: Record<string, number>
        }
      }
    ): MiniSearch

    search(
      query: string,
      options?: { fuzzy?: number | false; prefix?: boolean; combineWith?: 'AND' | 'OR' }
    ): SearchResult[]
  }
}
