---
'rowkit': minor
---

Add `Button` — four variants, three sizes, and a loading state that keeps `aria-busy` rather than `disabled`, so focus survives a request and a screen reader user is not thrown out of the form by their own submit. Clicks are swallowed in the capture phase while loading, and a non-native element takes `aria-disabled` instead, since `disabled` means nothing on an anchor.

_Recorded retroactively — this work predates Changesets being installed._
