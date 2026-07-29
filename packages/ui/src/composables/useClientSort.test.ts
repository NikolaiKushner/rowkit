import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import type { DataTableColumn, DataTableSort } from '../components/DataTable/types'
import { useClientSort } from './useClientSort'

interface User {
  id: number
  name: string
  seats: number
  lastSeen: Date | null
}

const users: User[] = [
  { id: 1, name: 'Ada Lovelace', seats: 3, lastSeen: new Date('2024-03-01') },
  { id: 2, name: 'Grace Hopper', seats: 12, lastSeen: null },
  { id: 3, name: 'Alan Turing', seats: 1, lastSeen: new Date('2020-01-01') },
]

const names = (rows: User[]) => rows.map((row) => row.name)

describe('useClientSort', () => {
  it('returns the rows untouched when unsorted', () => {
    const sorted = useClientSort(users, ref<DataTableSort<User>>())
    expect(sorted.value).toBe(users)
  })

  it('sorts ascending', () => {
    const sorted = useClientSort(users, ref({ key: 'name', direction: 'asc' } as const))
    expect(names(sorted.value)).toEqual(['Ada Lovelace', 'Alan Turing', 'Grace Hopper'])
  })

  it('sorts descending', () => {
    const sorted = useClientSort(users, ref({ key: 'name', direction: 'desc' } as const))
    expect(names(sorted.value)).toEqual(['Grace Hopper', 'Alan Turing', 'Ada Lovelace'])
  })

  it('compares numbers numerically', () => {
    // The bug this catches: 12 before 3 because "1" < "3".
    const sorted = useClientSort(users, ref({ key: 'seats', direction: 'asc' } as const))
    expect(names(sorted.value)).toEqual(['Alan Turing', 'Ada Lovelace', 'Grace Hopper'])
  })

  it('sinks blanks in both directions', () => {
    for (const direction of ['asc', 'desc'] as const) {
      const sorted = useClientSort(users, ref({ key: 'lastSeen', direction }))
      expect(names(sorted.value).at(-1), direction).toBe('Grace Hopper')
    }
  })

  it('never mutates the source', () => {
    const original = [...users]
    const sorted = useClientSort(users, ref({ key: 'name', direction: 'desc' } as const))
    expect(sorted.value).not.toEqual(users)
    expect(users).toEqual(original)
  })

  it('uses a column sortValue when one is given', () => {
    const columns: DataTableColumn<User>[] = [
      { key: 'name', header: 'Name', sortable: true, sortValue: (row) => row.seats },
    ]
    const sorted = useClientSort(users, ref({ key: 'name', direction: 'asc' } as const), columns)
    expect(names(sorted.value)).toEqual(['Alan Turing', 'Ada Lovelace', 'Grace Hopper'])
  })

  it('reacts to the sort changing', () => {
    const sort = ref<DataTableSort<User>>({ key: 'name', direction: 'asc' })
    const sorted = useClientSort(users, sort)
    expect(names(sorted.value)[0]).toBe('Ada Lovelace')

    sort.value = { key: 'name', direction: 'desc' }
    expect(names(sorted.value)[0]).toBe('Grace Hopper')
  })

  it('reacts to the rows changing', () => {
    const rows = ref<User[]>([...users])
    const sorted = useClientSort(rows, ref({ key: 'seats', direction: 'asc' } as const))
    expect(sorted.value).toHaveLength(3)

    rows.value = [...users, { id: 4, name: 'Zoe', seats: 0, lastSeen: null }]
    expect(names(sorted.value)[0]).toBe('Zoe')
  })

  it('accepts a getter as well as a ref', () => {
    const sorted = useClientSort(
      () => users,
      () => ({ key: 'name', direction: 'asc' }) as const
    )
    expect(names(sorted.value)[0]).toBe('Ada Lovelace')
  })

  /**
   * The cost, measured rather than asserted — see
   * `docs/decisions/004-datatable-performance.md`.
   *
   * A generous ceiling, because CI machines vary and a flaky perf test is worse
   * than none. It is here to catch an algorithmic regression — a comparator
   * that goes quadratic — not to police milliseconds.
   */
  it('sorts 10,000 rows well inside a frame budget', () => {
    const many: User[] = Array.from({ length: 10_000 }, (_, i) => ({
      id: i,
      name: `Person ${String((i * 7919) % 10_000)}`,
      seats: (i * 13) % 97,
      lastSeen: null,
    }))
    const sorted = useClientSort(many, ref({ key: 'name', direction: 'asc' } as const))

    const started = performance.now()
    const result = sorted.value
    const elapsed = performance.now() - started

    expect(result).toHaveLength(10_000)
    expect(result[0]?.name.localeCompare(result[9_999]?.name ?? '')).toBeLessThanOrEqual(0)
    expect(elapsed, `sorting 10k rows took ${elapsed.toFixed(0)}ms`).toBeLessThan(500)
  })
})
