---
'rowkit': patch
---

Fix Select having no visible focus indicator.

The trigger's styling sits on the anchor, which is a wrapper. The element that actually takes focus is the input inside it — Reka needs a real `ComboboxInput` to be the focusable combobox, and the anchor is never focused itself. `focus-visible:` on the anchor therefore matched nothing, ever: the Select had no focus ring at all, while its class list read exactly like every other control's. The anchor now uses `has-[:focus-visible]:`.

The regression test compares the anchor's computed `box-shadow` before and after tabbing to it. An earlier version of this test asserted only that a box-shadow was present, which passed with the bug still in place — `shadow-xs` is on the anchor at rest, so "has a shadow" is true either way. Focusing has to _change_ the shadow; that is the only assertion that separates the two.
