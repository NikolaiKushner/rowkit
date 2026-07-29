---
'rowkit': minor
---

Add `Badge` — a short, non-interactive status label for the status column of a
table.

Colour is the product of `variant` (neutral, primary, success, warning, danger)
and `appearance` (subtle, solid, outline), with `subtle` the default because a
column of solid badges reads as a wall of colour and stops communicating. An
optional `dot` gives the eye a shape to lock onto when the same few statuses
repeat down a page, and it is `aria-hidden` since it only restates the colour the
badge already carries.

_Recorded retroactively — this work predates Changesets being installed._
