---
'rowkit': minor
---

**DataTable is now a Windows 98 list view**, as drawn in the Figma file.

- **A white well in a sunken bevel**, with a visible caption (`captionVisible`) above it on the window face. Rows are 18px (`sm`) or 22px (`md`) with no grid lines; a selected row is navy with white text and stays navy when the table loses focus; a focused row gets the dotted rectangle.
- **Column headers are raised buttons.** A sortable header sinks while held and moves its label; the sorted column shows a ▲ or ▼ after its label. Focus is a dotted ring around the label. No hover anywhere: `hoverable` no longer has a visible effect, and `dataTableRowActionClass` no longer hides row actions until hover.
- **Win98 check boxes and option buttons** for selection: a 13×13 sunken box with a pixel check (a bar when partly checked), and the 12×12 round option button. Both stay native underneath.
- **New `numeric` column option**: the mono face for figures, aligned to the end unless `align` says otherwise.
- **Breaking: `class` now goes on the root**, which holds the caption and the frame, instead of on the scroll container. A height such as `max-h-96` still bounds the table and makes the body scroll.

**Skeleton is a dithered plate** instead of a grey pulse: text bars are 9px to sit on the 13px line, corners are square except the circle, and `animated` steps the checker 1px every 400ms (two frames, no easing) behind `motion-safe:`.
