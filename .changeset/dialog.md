---
'rowkit': minor
---

Add `Dialog`, built on Reka UI's primitive — focus trap, focus restore, scroll lock and background inerting come from there; rowkit supplies the API and the token styling. `title` is a required prop rather than only a slot, so `aria-labelledby` is always wired and replacing `#header` cannot break the accessible name.

`preventClose` blocks Escape and the scrim for flows where accidental dismissal loses work, but never removes the close button — a dialog with no exit is hostile. Only the body scrolls, so footer actions cannot be pushed off-screen, and the enter/exit animations are gated behind `motion-safe:`.
