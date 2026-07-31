import { describe, expect, it } from 'vitest'
import { buildPropsTables, injectTables, readDocPages } from '../scripts/generate-props.mjs'

/**
 * The props tables in `docs/components/*.md` are generated, and this is what
 * makes that true rather than aspirational.
 *
 * A generator nobody runs is worse than a hand-written table, because the table
 * at least looked suspicious. Adding a prop, renaming one, changing a default or
 * editing a JSDoc comment all fail here until `node
 * packages/ui/scripts/generate-props.mjs` has been run and the result committed.
 */

const tables = await buildPropsTables()
const pages = await readDocPages()

describe('generated props tables', () => {
  it('found every component', () => {
    // Guards against the glob silently matching nothing and every assertion
    // below passing on an empty set.
    expect(tables.size).toBe(13)
  })

  it('documents twelve pages', () => {
    expect(pages).toHaveLength(12)
  })

  it('keeps every marker, on the page with two of them', async () => {
    /*
     * An earlier version of the block regular expression consumed from the
     * first opening marker to the first closing one, which on `field.md` meant
     * matching straight across `InputProps` and deleting it. The page still
     * looked plausible — one heading, one table — and every other assertion
     * here passed, because a table that no longer exists cannot drift.
     */
    const count = (text: string) => text.match(/<!-- @props \w+ -->/g)?.length ?? 0
    expect(pages.reduce((total, page) => total + count(page.content), 0)).toBe(13)

    for (const page of pages) {
      const regenerated = await injectTables(page.content, tables, page.path)
      expect(count(regenerated), `${page.path} lost a marker`).toBe(count(page.content))
    }
  })

  it.each(pages.map((page) => [page.path.split('/').at(-1), page] as const))(
    '%s is up to date',
    async (_name, page) => {
      const missing: string[] = []
      const regenerated = await injectTables(page.content, tables, page.path, (name) =>
        missing.push(name)
      )

      expect(missing, 'marker names a props interface that does not exist').toEqual([])
      expect(
        regenerated,
        'docs have drifted from the source — run `node packages/ui/scripts/generate-props.mjs`'
      ).toBe(page.content)
    }
  )

  it('never emits an empty table', () => {
    for (const [name, table] of tables) {
      expect(table.split('\n').length, `${name} generated a header and no rows`).toBeGreaterThan(2)
    }
  })

  it('resolves indirect types rather than printing the alias', () => {
    // `NonNullable<BadgeVariants['variant']>` is what the source says and tells
    // a reader nothing. This is the whole reason the generator runs the type
    // checker instead of reading the syntax.
    expect(tables.get('BadgeProps')).toContain("`'neutral' \\| 'primary'")
    expect(tables.get('BadgeProps')).not.toContain('NonNullable')
    expect(tables.get('TooltipProps')).not.toContain('TooltipPlacement')
  })

  it('reads defaults through the generic components too', () => {
    // A regex for `withDefaults(defineProps<DataTableProps<TRow>>(), …)` closes
    // at the first `>`, which reported no defaults at all for exactly the
    // components whose props are hardest to guess.
    expect(tables.get('DataTableProps')).toContain('`5`')
    expect(tables.get('SelectProps')).toContain("`'Select…'`")
  })

  it('marks required props as required', () => {
    expect(tables.get('DataTableProps')).toContain('| `caption` | `string` | **required** |')
  })
})
