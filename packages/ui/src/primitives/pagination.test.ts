import { describe, expect, it } from 'vitest'
import { pageCount, pageItems, type PageItem } from './pagination'

const show = (items: PageItem[]) =>
  items.map((item) => (item.type === 'page' ? item.value : '…')).join(' ')

describe('pageCount', () => {
  it.each([
    [0, 10, 1],
    [1, 10, 1],
    [10, 10, 1],
    [11, 10, 2],
    [95, 25, 4],
  ])('%i rows at %i a page is %i pages', (total, perPage, expected) => {
    expect(pageCount(total, perPage)).toBe(expected)
  })

  it('treats a zero page size as one row a page rather than dividing by zero', () => {
    expect(pageCount(3, 0)).toBe(3)
  })
})

describe('pageItems', () => {
  it.each([
    [1, 10, 1, true, '1 2 3 4 5 … 10'],
    [5, 10, 1, true, '1 … 4 5 6 … 10'],
    [10, 10, 1, true, '1 … 6 7 8 9 10'],
    [3, 5, 1, true, '1 2 3 4 5'],
    [5, 10, 1, false, '4 5 6'],
    [1, 10, 1, false, '1 2 3'],
  ] as const)(
    'page %i of %i, %i siblings, edges %s → %s',
    (current, count, siblings, edges, expected) => {
      expect(show(pageItems(current, count, siblings, edges))).toBe(expected)
    }
  )

  it('keeps the row the same length as the current page moves', () => {
    const lengths = new Set(
      Array.from({ length: 20 }, (_, i) => pageItems(i + 1, 20, 1, true).length)
    )
    expect(lengths).toEqual(new Set([7]))
  })
})
