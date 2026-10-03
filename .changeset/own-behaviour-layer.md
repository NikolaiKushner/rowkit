---
'rowkit': patch
---

rowkit is moving off Reka UI onto its own behaviour layer, one component at a time. Public APIs and rendered output stay the same.

- `Button`, `Badge`, `Skeleton` and `EmptyState` render through rowkit's own `Primitive`; `as` and `as-child` behave exactly as before, pinned against Reka's output in the test suite.
- `Field` renders a native `<label>`, keeping the guard that stops a double-click from selecting the label text.
