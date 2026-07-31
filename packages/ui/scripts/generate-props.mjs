/**
 * Generates the props tables in `docs/components/*.md` from the source.
 *
 * A hand-written props table is stale by the second release. Every prop already
 * carries a JSDoc comment — that rule exists since Phase 0 for exactly this
 * payoff — so the table is derived rather than transcribed.
 *
 * The extraction itself lives in `component-api.mjs`, shared with the
 * `AGENTS.md` generator so the two cannot disagree about what a component takes.
 *
 * Run `pnpm docs:props` to rewrite the tables; `src/props-docs.test.ts` fails if
 * the committed docs have drifted.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { globSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'
import { buildComponentApi, repoRoot, summarise } from './component-api.mjs'

/** Table cells are pipe-delimited; a union type would end the column. */
const escapeCell = (text) => text.replaceAll('|', '\\|')

/** One markdown table per exported `*Props` interface, keyed by its name. */
export async function buildPropsTables() {
  const components = await buildComponentApi()
  const tables = new Map()

  for (const { propsType, props } of components.values()) {
    const rows = props.map((prop) => {
      const fallback = prop.required ? '**required**' : (prop.default ?? '—')
      const cell =
        fallback.startsWith('**') || fallback === '—' ? fallback : `\`${escapeCell(fallback)}\``
      return (
        `| \`${prop.name}\` | \`${escapeCell(prop.type)}\` | ${cell} | ` +
        `${escapeCell(summarise(prop.description))} |`
      )
    })

    tables.set(
      propsType,
      ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows].join('\n')
    )
  }

  return tables
}

/**
 * Replaces the contents of every `<!-- @props Name -->` … `<!-- /@props -->`
 * block in a docs page. A page opts in by carrying the markers, so a page that
 * needs a hand-written table can still have one and say why.
 *
 * The result goes through Prettier before it is returned, because Prettier
 * formats `docs/**` and aligns markdown table columns. Emitting compact tables
 * would mean `pnpm format` and this script fighting over every page, each one
 * undoing the other, and the drift test failing after either.
 */
export async function injectTables(markdown, tables, filepath, onMissing) {
  const injected = markdown.replace(
    /<!-- @props (\w+) -->[\s\S]*?<!-- \/@props -->/g,
    (_match, name) => {
      const open = `<!-- @props ${name} -->`
      const close = '<!-- /@props -->'
      const table = tables.get(name)
      if (table === undefined) {
        onMissing?.(name)
        return `${open}\n${close}`
      }
      return `${open}\n\n${table}\n\n${close}`
    }
  )

  const options = await resolveConfig(filepath)
  return format(injected, { ...options, filepath })
}

/** The docs pages carrying at least one marker, with their current text. */
export async function readDocPages() {
  const files = globSync('docs/components/*.md', { cwd: repoRoot }).map((file) =>
    join(repoRoot, file)
  )
  const pages = []
  for (const path of files.sort()) {
    const content = await readFile(path, 'utf8')
    if (content.includes('<!-- @props ')) pages.push({ path, content })
  }
  return pages
}

// Running the file rewrites the docs; importing it does not.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tables = await buildPropsTables()
  const missing = []
  let written = 0

  for (const { path, content } of await readDocPages()) {
    const next = await injectTables(content, tables, path, (name) =>
      missing.push(`${path}: ${name}`)
    )
    if (next !== content) {
      await writeFile(path, next)
      written += 1
    }
  }

  console.log(`${tables.size} tables generated, ${written} page(s) rewritten`)
  if (missing.length > 0) {
    console.error(`No such props interface:\n  ${missing.join('\n  ')}`)
    process.exitCode = 1
  }
}
