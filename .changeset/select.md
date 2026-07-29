---
'rowkit': minor
---

Add `Select` — generic over its value type, with optional search, async options
and full keyboard support, built on Reka UI's Combobox.

The focusable anchor is the combobox input rather than the trigger button. Reka
gives the trigger `tabindex="-1"` and `aria-label="Show popup"` on the assumption
that an input is present to be the real control; without one the select is
unreachable by keyboard and announces itself as "Show popup" instead of its field
label.

`manualFilter` hands filtering to the consumer for options fetched per keystroke,
where filtering again locally would hide results that matched on a field the
label does not show.

Includes a workaround for an upstream Reka issue: the combobox keeps its
highlight after the panel closes, leaving `aria-activedescendant` pointing at an
unmounted list item. It is cleared for as long as the panel is shut. To be
removed when fixed upstream.

_Recorded retroactively — this work predates Changesets being installed._
