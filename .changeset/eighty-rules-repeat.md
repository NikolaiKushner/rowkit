---
'rowkit': patch
---

Make every table row the same height, loaded or loading, and remove the doubled rule under the header.

**Row height.** A `size="sm"` button is 32px, and at `p-2` that lifted a row with actions to 48px while the placeholder standing in for it stayed at the 40px minimum — a measured 9px jump per row, at the moment the data arrived, on the very table this library exists to render. The fix is `py-1` rather than a taller placeholder: with 4px of vertical padding a 32px control fits inside the 40px row minimum, so text, a badge, a button and a skeleton all produce exactly the same height. A taller placeholder would only have inverted the problem for tables without actions.

**The rule under the header.** The header draws its separator as an inset shadow and every body cell draws its own top border, so at the first row two paints landed on the same boundary and read as a heavier line than between any other pair of rows. The first row's border is now suppressed.

Getting there needed a fix to the variants gate itself: its selector matcher did not escape `&`, so any Tailwind arbitrary variant looked like it had generated no CSS. That false negative is what ruled out the correct fix the first time it was tried.

The height gate now renders a real action button. Without it the story compiled but the button never mounted, and the test passed against `p-2` — a gate measuring nothing while reporting success.
