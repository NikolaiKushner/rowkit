import { mount } from '@vue/test-utils'
import { PaginationList, PaginationRoot } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { pageCount, pageItems, type PageItem } from './pagination'

/** What Reka's PaginationList hands its slot for the same inputs. */
function rekaItems(current: number, count: number, siblings: number, showEdges: boolean) {
  let items: PageItem[] = []
  mount(PaginationRoot, {
    props: { page: current, total: count, itemsPerPage: 1, siblingCount: siblings, showEdges },
    slots: {
      default: () =>
        h(PaginationList, null, {
          default: ({ items: list }: { items: PageItem[] }) => {
            items = list
            return null
          },
        }),
    },
  })
  return items
}

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

  /*
   * Ported, not rewritten, so the rows must match Reka's for every input the
   * component can produce. While Reka is still installed, check them all.
   */
  it('matches Reka UI for every page, page count, sibling count and edge setting', () => {
    for (const showEdges of [true, false]) {
      for (let siblings = 0; siblings <= 3; siblings++) {
        for (let count = 1; count <= 25; count++) {
          for (let current = 1; current <= count; current++) {
            expect(
              show(pageItems(current, count, siblings, showEdges)),
              `page ${current}/${count}, siblings ${siblings}, edges ${showEdges}`
            ).toBe(show(rekaItems(current, count, siblings, showEdges)))
          }
        }
      }
    }
  })
})
