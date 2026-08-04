---
'rowkit': patch
---

Remove a stray rule above the select column's header.

The header's checkbox cell composes the header-cell variant with the select-cell one, and inherited a `border-t` meant for body rows. It painted a short line above the checkbox column only, floating above the table with nothing to its right. The select-cell variant now takes a `header` flag that drops it.

Also adds a gate on loading-row height: a placeholder row has to be exactly as tall as the row it stands in for, or the table grows at the moment the data lands and every row below jumps — the layout shift a skeleton exists to prevent, delivered by the skeleton itself.

That gate documents a real limitation it cannot fix. Parity holds for the cells rowkit renders, but not once a cell slot puts something taller than a line of text in a row: a `size="sm"` button is 32px, which lifts the row to 48px while the placeholder stays at the 40px minimum — a measured 9px jump per row. The component cannot know the height of markup it did not render. The `#loading` slot is the escape hatch until a per-column placeholder exists.
