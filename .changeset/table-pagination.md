---
'rowkit': minor
---

Add `TablePagination` — a range summary, a rows-per-page select and numbered pages, built on Reka's Pagination primitive with `showEdges` defaulted on so a user on page 12 of 25 can see how far the table runs and reach the end. It never moves the page itself: changing the page size emits `update:pageSize` and nothing else, because only the application knows whether a page change also means a refetch.
