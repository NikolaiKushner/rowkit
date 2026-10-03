---
'rowkit': patch
---

`Button`, `Badge`, `Skeleton` and `EmptyState` render through rowkit's own `Primitive` instead of Reka UI's. `as` and `as-child` behave exactly as before — the output is pinned against Reka's in the test suite. This is the first step of moving rowkit off a behaviour library.
