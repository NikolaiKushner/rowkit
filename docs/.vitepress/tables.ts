import type { MarkdownRenderer } from 'vitepress'

/**
 * Markdown tables, ready for a phone. Each table sits in a `.rk-table` box
 * that scrolls sideways when the table is wider than the page, so the page
 * itself never does. Each cell carries its column's header as `data-label`,
 * and a props table — its first header «Prop» — has its box marked `.rk-props`, so on
 * a phone it can turn into the definition list Figma draws: name and type on
 * one line, the description under them.
 */
export function tables(md: MarkdownRenderer): void {
  md.core.ruler.push('rk-tables', (state) => {
    let table: (typeof state.tokens)[number] | undefined
    let labels: string[] = []
    let column = 0
    let head = false
    state.tokens.forEach((token, index) => {
      switch (token.type) {
        case 'table_open':
          table = token
          labels = []
          break
        case 'thead_open':
          head = true
          break
        case 'thead_close':
          head = false
          if (table && labels[0] === 'Prop') table.info = 'props'
          break
        case 'tr_open':
          column = 0
          break
        case 'th_open':
          if (head) labels.push(state.tokens[index + 1]?.content.trim() ?? '')
          break
        case 'td_open': {
          const label = labels[column]
          if (label) token.attrSet('data-label', label)
          // «—»: nothing in the cell, which the phone's list leaves out.
          if (state.tokens[index + 1]?.content.trim() === '—') token.attrSet('data-empty', '')
          column += 1
          break
        }
      }
    })
  })

  const open = md.renderer.rules.table_open
  const close = md.renderer.rules.table_close
  md.renderer.rules.table_open = (tokens, index, options, env, self) =>
    `<div class="${tokens[index]?.info === 'props' ? 'rk-table rk-props' : 'rk-table'}">${open ? open(tokens, index, options, env, self) : self.renderToken(tokens, index, options)}`
  md.renderer.rules.table_close = (tokens, index, options, env, self) =>
    `${close ? close(tokens, index, options, env, self) : self.renderToken(tokens, index, options)}</div>`
}
