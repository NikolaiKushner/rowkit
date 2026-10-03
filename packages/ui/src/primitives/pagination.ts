/** One slot in a pagination row: a page button or a gap. */
export type PageItem = { type: 'page'; value: number } | { type: 'ellipsis' }

/** Pages needed to show `total` rows at `perPage` a page. Never less than one. */
export function pageCount(total: number, perPage: number): number {
  const size = Math.max(1, perPage)
  return Math.max(1, Math.ceil(total / size))
}

const gap: PageItem = { type: 'ellipsis' }

function run(from: number, to: number): PageItem[] {
  const out: PageItem[] = []
  for (let value = from; value <= to; value++) out.push({ type: 'page', value })
  return out
}

/**
 * The pages to show around `current`.
 *
 * The row is a fixed number of slots, so the buttons never jump under the
 * pointer as the current page moves.
 *
 * With `showEdges` there are `2 * siblings + 5` slots: the first page, a gap,
 * the current page with `siblings` on each side, a gap, the last page. Near
 * either end the gap on that side is not needed, and the freed slots go to
 * pages instead — so a gap always stands for at least two hidden pages.
 *
 * Without `showEdges` there are `2 * siblings + 1` slots: a window around the
 * current page that stops at the first and last page. No gaps.
 *
 * When every page fits in the slots, every page is shown.
 */
export function pageItems(
  current: number,
  count: number,
  siblings: number,
  showEdges: boolean
): PageItem[] {
  const slots = showEdges ? 2 * siblings + 5 : 2 * siblings + 1
  if (count <= slots) return run(1, count)

  if (!showEdges) {
    const start = Math.min(Math.max(current - siblings, 1), count - slots + 1)
    return run(start, start + slots - 1)
  }

  // Pages that fit between an edge and its gap when the gap is on one side only.
  const span = slots - 2
  const nearStart = current <= siblings + 3
  const nearEnd = current >= count - siblings - 2

  if (nearStart) return [...run(1, span), gap, ...run(count, count)]
  if (nearEnd) return [...run(1, 1), gap, ...run(count - span + 1, count)]
  return [
    ...run(1, 1),
    gap,
    ...run(current - siblings, current + siblings),
    gap,
    ...run(count, count),
  ]
}
