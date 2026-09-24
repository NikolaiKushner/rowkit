---
'rowkit': minor
---

**Breaking (Dialog).** `Dialog` is now a set of parts. `title`, `description`, `size`, `preventClose`, and `closeLabel` are no longer props of `Dialog`, and the `header`, `footer`, and default slots are gone.

Place `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, and `DialogFooter` yourself. `size`, `preventClose`, `closeLabel`, and `class` move to `DialogContent`. The accessible name comes from `DialogTitle`. The portal, the scrim, and the close button stay inside `DialogContent`. `v-model:open` is unchanged and is now optional: with no model, the trigger still toggles.
