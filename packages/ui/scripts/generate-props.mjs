/**
 * Generates the props tables in `docs/components/*.md` from the source.
 *
 * A hand-written props table is stale by the second release. Every prop already
 * carries a JSDoc comment — that rule exists since Phase 0 for exactly this
 * payoff — so the table is derived rather than transcribed.
 *
 * Types come from the TypeScript checker rather than the syntax, because the
 * interesting ones are indirect: `NonNullable<BadgeVariants['variant']>` is
 * what the source says and `'neutral' | 'primary' | …` is what a consumer needs
 * to read. Defaults come from each SFC's `withDefaults` call, so the table
 * cannot claim a default the component does not apply.
 *
 * Run `node scripts/generate-props.mjs` to rewrite the tables;
 * `src/props-docs.test.ts` fails if the committed docs have drifted.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { globSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'
import ts from 'typescript'
import { parse as parseSfc } from 'vue/compiler-sfc'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(packageRoot, '../..')

/**
 * Types whose resolved form is technically accurate and useless to read.
 *
 * `HTMLAttributes['class']` expands to Vue's four-way union including
 * `Record<string, any>`, and `PrimitiveProps['as']` to Reka's full component
 * union. A consumer needs to know what to pass, not what the type system will
 * tolerate, so these are stated as written rather than as resolved.
 */
const TYPE_ALIASES = new Map([
  ["HTMLAttributes['class']", 'string'],
  ["PrimitiveProps['as']", 'string | Component'],
  ["PrimitiveProps['asChild']", 'boolean'],
])

/** Table cells are pipe-delimited; a union type would end the column. */
const escapeCell = (text) => text.replaceAll('|', '\\|')

const TYPE_FORMAT =
  ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType

/**
 * The type a consumer needs to read, which is rarely the one the source says.
 *
 * Unions are expanded to their constituents rather than printed as whatever
 * alias happens to name them: `TooltipPlacement` tells a reader nothing, and
 * `'top' | 'right' | 'bottom' | 'left'` tells them everything. The optionality
 * wrapper goes too — a table with a `Default` column has already said it.
 */
function stringifyType(checker, type) {
  const nonNullable = checker.getNonNullableType(type)
  if (!nonNullable.isUnion()) return checker.typeToString(nonNullable, undefined, TYPE_FORMAT)

  const constituents = nonNullable.types
    .filter((member) => (member.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) === 0)
    .map((member) => checker.typeToString(member, undefined, TYPE_FORMAT))

  // `boolean` is internally `true | false`, and nobody wants to read that.
  const collapsed = constituents.filter((name) => name !== 'true' && name !== 'false')
  if (collapsed.length !== constituents.length) collapsed.unshift('boolean')

  return collapsed.join(' | ')
}

/**
 * The description for a props table: as much of the first paragraph as reads
 * as a summary, and no more.
 *
 * Many of these comments run to several paragraphs explaining a decision. That
 * belongs on the page in prose, not wedged into a table cell.
 */
function summarise(comment) {
  const [paragraph = ''] = comment.split(/\n\s*\n/)
  const collapsed = paragraph.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= 140) return collapsed
  const [firstSentence] = collapsed.match(/^.*?[.!?](?=\s|$)/) ?? [collapsed]
  return firstSentence
}

/**
 * Reads the `withDefaults(defineProps<…>(), { … })` object out of an SFC.
 *
 * Parsed rather than pattern-matched. A regular expression for this looked
 * fine and was wrong on every generic component: `defineProps<DataTableProps<
 * TRow>>()` closes the match at the first `>`, so `DataTable` and `Select`
 * reported no defaults at all while the simpler components looked correct.
 */
async function readDefaults(componentDir, componentName) {
  let source
  try {
    source = await readFile(join(componentDir, `${componentName}.vue`), 'utf8')
  } catch {
    return new Map()
  }

  const { descriptor } = parseSfc(source)
  const script = descriptor.scriptSetup ?? descriptor.script
  if (script === null) return new Map()

  const scriptAst = ts.createSourceFile(
    `${componentName}.ts`,
    script.content,
    ts.ScriptTarget.ES2022,
    true
  )

  const defaults = new Map()

  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'withDefaults' &&
      node.arguments.length > 1 &&
      ts.isObjectLiteralExpression(node.arguments[1])
    ) {
      for (const property of node.arguments[1].properties) {
        if (!ts.isPropertyAssignment(property)) continue
        defaults.set(property.name.getText(scriptAst), property.initializer.getText(scriptAst))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(scriptAst)

  return defaults
}

/** One markdown table per exported `*Props` interface, keyed by its name. */
export async function buildPropsTables() {
  const files = globSync('src/components/*/types.ts', { cwd: packageRoot }).map((file) =>
    join(packageRoot, file)
  )

  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    exactOptionalPropertyTypes: true,
    skipLibCheck: true,
  })
  const checker = program.getTypeChecker()
  const tables = new Map()

  for (const file of files.sort()) {
    const componentDir = dirname(file)
    const componentName = componentDir.split('/').at(-1)
    const defaults = await readDefaults(componentDir, componentName)
    const sourceFile = program.getSourceFile(file)

    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isInterfaceDeclaration(node)) return
      if (!node.name.text.endsWith('Props')) return

      const rows = []
      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || member.name === undefined) continue

        const name = member.name.getText(sourceFile)
        const declared = member.type?.getText(sourceFile) ?? ''
        const symbol = checker.getSymbolAtLocation(member.name)
        const type =
          TYPE_ALIASES.get(declared) ??
          stringifyType(checker, checker.getTypeOfSymbolAtLocation(symbol, member))
        const required = member.questionToken === undefined
        /*
         * An optional `boolean` with no entry in `withDefaults` still defaults
         * to `false`, not to absent: Vue casts a missing Boolean prop rather
         * than leaving it `undefined`. Printing `—` there would document a
         * state the component cannot be in.
         */
        const fallback = defaults.get(name) ?? (type === 'boolean' ? 'false' : undefined)

        rows.push({
          name,
          type,
          default: required ? '**required**' : (fallback ?? '—'),
          description: summarise(ts.displayPartsToString(symbol.getDocumentationComment(checker))),
        })
      }

      if (rows.length === 0) return

      const table = [
        '| Prop | Type | Default | Description |',
        '| --- | --- | --- | --- |',
        ...rows.map(
          (row) =>
            `| \`${row.name}\` | \`${escapeCell(row.type)}\` | ` +
            `${row.default === '—' || row.default.startsWith('**') ? row.default : `\`${escapeCell(row.default)}\``} | ` +
            `${escapeCell(row.description)} |`
        ),
      ].join('\n')

      tables.set(node.name.text, table)
    })
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
