---
'rowkit': minor
---

Tighten padding on the overlay and empty surfaces.

Dialog drops from `p-6` to `p-4` across header, body and footer, its footer gap from `gap-3` to `gap-2`, and its close button moves in to match. Toast goes from `p-4` to `p-3`. EmptyState loses roughly a third of its vertical padding at every size.

Control geometry is untouched. `--spacing` stays at `0.25rem`, so `h-9` is still 36px and `p-4` still 16px — in Tailwind v4 heights derive from the same variable as padding, and shrinking the base would have quietly pulled every button, input and select trigger off the reference height while producing fractional pixels.

Table density is also untouched: cells were already at `p-2`, which is where the reference sets them.
