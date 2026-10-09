/**
 * Syntax colours for the landing page's few code samples: TypeScript, a Vue
 * template and two CSS imports.
 *
 * Not a general highlighter, and deliberately so. The samples are fixed and
 * short; a dozen lines of rules colour them as the Figma page does (`site/code-*`:
 * keyword, string, number, comment, tag, attribute) in each theme, where
 * VitePress's highlighter would bring its own palette and only one of it.
 */
export type TokenKind = 'plain' | 'keyword' | 'string' | 'number' | 'comment' | 'tag' | 'attr'

export interface Token {
  kind: TokenKind
  text: string
}

const KEYWORDS = new Set(['import', 'from', 'export', 'const', 'let', 'return'])

/**
 * One rule per token, tried in order at the current position. A tag opens
 * «inside a tag», where a bare word is an attribute; `>` closes it — across
 * lines, since a component's attributes are one per line.
 */
const RULES: [RegExp, (text: string, inTag: boolean) => TokenKind][] = [
  [/\/\/[^\n]*/y, () => 'comment'],
  [/'[^'\n]*'|"[^"\n]*"|`[^`\n]*`/y, () => 'string'],
  [/<\/?[A-Za-z][\w.-]*/y, () => 'tag'],
  [/\/?>/y, (_, inTag) => (inTag ? 'tag' : 'plain')],
  // `@import`, not the `@beta` of a package's tag.
  [/(?<![\w])@[a-z]+/y, () => 'keyword'],
  [
    /[:@]?[A-Za-z_$][\w$.-]*(?::[\w-]+)?/y,
    (text, inTag) => (inTag ? 'attr' : KEYWORDS.has(text) ? 'keyword' : 'plain'),
  ],
  [/\d+(?:\.\d+)?/y, () => 'number'],
]

export function highlight(code: string): Token[][] {
  let inTag = false
  return code.split('\n').map((line) => {
    const tokens: Token[] = []
    const push = (kind: TokenKind, text: string) => {
      const last = tokens.at(-1)
      if (last?.kind === kind) last.text += text
      else tokens.push({ kind, text })
    }

    let at = 0
    outer: while (at < line.length) {
      for (const [pattern, kindOf] of RULES) {
        pattern.lastIndex = at
        const match = pattern.exec(line)
        if (!match) continue
        const text = match[0]
        const kind = kindOf(text, inTag)
        if (kind === 'tag') inTag = !text.endsWith('>')
        push(kind, text)
        at += text.length
        continue outer
      }
      push('plain', line[at] ?? '')
      at += 1
    }
    return tokens
  })
}
