---
'rowkit': minor
---

Add `Button` — variants (primary, secondary, ghost, danger), three sizes, and a
loading state.

A loading button keeps `aria-busy` rather than `disabled`, so focus is not lost
mid-request and a screen reader user is not thrown out of the form by their own
submit. Clicks are swallowed in the capture phase while loading or disabled, so
a handler cannot fire twice. When rendered as something other than a native
button it takes `aria-disabled` instead, since `disabled` means nothing on a
`<a>` or a `<div>`.

_Recorded retroactively — this work predates Changesets being installed._
