/** One slot in a pagination row: a page button or a gap. */
export type PageItem = { type: 'page'; value: number } | { type: 'ellipsis' }

/** Pages needed to show `total` rows at `perPage` a page. Never less than one. */
export function pageCount(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / (perPage || 1)))
}

/**
 * The pages to show around `current`.
 *
 * With `showEdges`, the first and last page always appear, and a gap of more
 * than one page collapses into an ellipsis. The row length stays constant as
 * the current page moves — `2 * siblings + 5` slots, or fewer when there are
 * fewer pages — so the buttons do not jump under the pointer.
 *
 * Without `showEdges`, a sliding window of `2 * siblings + 1` pages, clamped
 * to the ends, with no ellipses.
 */
export function pageItems(
  current: number,
  count: number,
  siblings: number,
  showEdges: boolean
): PageItem[] {
  return range(current, count, siblings, showEdges).map((value) =>
    value === ELLIPSIS ? { type: 'ellipsis' } : { type: 'page', value }
  )
}

const ELLIPSIS = 0

function span(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

function range(current: number, count: number, siblings: number, showEdges: boolean): number[] {
  const first = 1
  const last = count
  const left = Math.max(current - siblings, first)
  const right = Math.min(current + siblings, last)

  if (!showEdges) {
    const window = siblings * 2 + 1
    if (count < window) return span(first, last)
    if (current <= siblings + 1) return span(first, window)
    if (count - current <= siblings) return span(count - window + 1, last)
    return span(left, right)
  }

  // Siblings either side, plus first, last, current and the two ellipses.
  const slots = Math.min(2 * siblings + 5, count)
  // One ellipsis and one edge page take two of those slots.
  const run = slots - 2

  const leftGap =
    left > first + 2 && Math.abs(last - run - first + 1) > 2 && Math.abs(left - first) > 2
  const rightGap = right < last - 2 && Math.abs(last - run) > 2 && Math.abs(last - right) > 2

  if (!leftGap && rightGap) return [...span(first, run), ELLIPSIS, last]
  if (leftGap && !rightGap) return [first, ELLIPSIS, ...span(last - run + 1, last)]
  if (leftGap && rightGap) return [first, ELLIPSIS, ...span(left, right), ELLIPSIS, last]
  return span(first, last)
}
