---
'rowkit': minor
---

**DataTable keeps its header still while it reloads.** Switching `loading` on after rows were shown holds every column at the width it had, so a sort, a page change or a filter no longer resizes the columns to the placeholders and back. On a first load, give columns a `width` for the same effect.

`loadingRows` now defaults to 6, as in the Figma table (was 5).
