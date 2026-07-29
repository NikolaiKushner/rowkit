---
'rowkit': minor
---

Add `Skeleton` — loading placeholders in three geometries, composable into the shape of the content being waited for. The pulse is `motion-safe:` only so it never renders for anyone who has asked for reduced motion, and every variant carries a default height, since a placeholder that collapses to zero still produces the layout jump it exists to prevent.
