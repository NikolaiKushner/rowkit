---
'rowkit': patch
---

Fix a `sticky` column losing its own header in `DataTable`.

Every header cell sat on the same `z-sticky` layer, so at equal z-index the
later cells in the DOM painted over the pinned one. Scrolling right slid the
neighbouring header straight across the pinned column's heading, while the
pinned body cells below stayed put — the column kept its data and lost its name.

The header row now establishes one stacking context and the pinned cell is
ordered inside it. No API change.

If your application places rowkit under a **fixed header of its own**, note that
`--z-index-sticky` is `100`: a table's sticky header will paint over any chrome
below that. Raise your header above it.
