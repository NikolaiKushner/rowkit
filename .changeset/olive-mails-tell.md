---
'rowkit': minor
---

**Breaking:** `TablePagination` is now `Pagination`.

Marked `minor`, not `major`, on purpose: this is a 0.x line, and changesets turns a `major` there straight into `1.0.0`. Version 1.0 is meant to follow the API surviving contact with real applications, not a rename.

The old name claimed a coupling that never existed — the component pages a list, and a list can be cards or a feed as easily as rows. With `hidePageSize` and `hideSummary` it was already a standalone pager; the name was the only thing suggesting otherwise.

Rename in three places:

- the component: `<TablePagination>` → `<Pagination>`
- the types: `TablePaginationProps` → `PaginationProps`, `TablePaginationVariants` → `PaginationVariants`
- the variant functions: `tablePaginationItemVariants` → `paginationItemVariants`, and the same for `paginationVariants`, `paginationEllipsisVariants`, `paginationSummaryVariants`

No prop, event or slot changed. The docs page moves to `/components/pagination`.

The current page is now **outlined rather than filled**. A filled dark square was the loudest thing in the footer and competed with the primary action above it. It uses the control-boundary token rather than the decorative hairline, because that outline is the only visual carrier of "you are here" and has to clear 3:1 — `aria-current` carries the same state to assistive tech, but a sighted keyboard user still has to see it.
