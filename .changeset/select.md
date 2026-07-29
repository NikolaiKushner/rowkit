---
'rowkit': minor
---

Add `Select` — generic over its value type, with optional search, async options and full keyboard support, built on Reka UI's Combobox with the input as the focusable anchor rather than the trigger, which Reka gives `tabindex="-1"` and labels "Show popup". Includes a workaround for an upstream Reka issue that leaves `aria-activedescendant` pointing at an unmounted list item after the panel closes.

_Recorded retroactively — this work predates Changesets being installed._
