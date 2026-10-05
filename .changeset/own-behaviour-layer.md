---
'rowkit': patch
---

rowkit is moving off Reka UI onto its own behaviour layer, one component at a time. Public APIs and rendered output stay the same.

- `Button`, `Badge`, `Skeleton` and `EmptyState` render through rowkit's own `Primitive`; `as` and `as-child` behave exactly as before, pinned against Reka's output in the test suite.
- `Field` renders a native `<label>`, keeping the guard that stops a double-click from selecting the label text.
- `DataTable`'s row and select-all checkboxes use rowkit's own tri-state checkbox: same roles, `aria-checked` and `data-state` as before, Space toggles, Enter does not.
- `Pagination` renders its own `<nav>` and buttons with the same labels, `aria-current` and disabled states; the page-range calculation is ported from Reka and checked against it for every input.
- `Dialog` runs on rowkit's own focus scope, dismissable layer, presence, scroll lock and hide-others primitives, ported from Reka. Focus moves in on open and back to the trigger on close, Tab stays inside, Escape and an outside click close it (or not, with `preventClose`), the page behind is hidden from assistive technology and does not scroll. A `Select` open inside a `Dialog` now closes on its own Escape without closing the dialog.
