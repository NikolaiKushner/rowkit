import { createContentLoader } from 'vitepress'
import { firstParagraph } from '../../social'

export interface ComponentSummary {
  /** `/components/data-table` */
  url: string
  /** What the page opens with: the same text as its link preview. */
  description: string
}

declare const data: ComponentSummary[]
export { data }

/** Every component page's opening paragraph, read at build time. */
export default createContentLoader('components/*.md', {
  includeSrc: true,
  transform: (pages) =>
    pages
      .filter((page) => !page.url.endsWith('/components/'))
      .map((page) => ({
        url: page.url.replace(/\.html$/, ''),
        description: firstParagraph(page.src ?? '', 110) ?? '',
      })),
})
