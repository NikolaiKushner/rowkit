---
'rowkit': minor
---

**FilterBar is now the Windows 98 toolbar from the Figma file**: one row on the silver face with 4px of padding and gaps, wrapping when the chips run out of room — search field (200px), your controls, the chips, the result count, then «Clear filters» as a command button. Chips are flat: white, a 1px grey border, 19px (`sm`) or 21px (`md`) tall, with a flat 13px ✕ that shows a dotted focus ring. **Backspace or Delete on a chip's ✕ now removes that chip.**

Breaking, on 0.x so marked minor:

- The search box, controls, chips, count and clear button share one wrapping row instead of a controls row above a chips row. `filterBarControlsVariants` and `filterBarChipsVariants` are now layout-transparent (`contents`).
- The `clearLabel` default changes from "Clear all" to "Clear filters", and the button is a raised command button instead of a ghost one.
- `filterBarChipRemoveVariants` and `filterBarSummaryVariants` drop their `size` variant.
