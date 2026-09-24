---
'rowkit': patch
---

**Components.** Every component root, and the named parts inside Dialog and Field, now expose a `data-slot`. Style and tests can target `data-slot="dialog-title"` instead of a class string, which stays an implementation detail.
