---
'rowkit': minor
---

Add the `cn` class-merge utility and the `rowkit/styles` entry point. `cn` extends `tailwind-merge` with rowkit's own scales read from the token package, so a new token cannot fall out of sync with the merge rules; `rowkit/styles` declares the theme and registers the bundle as a Tailwind source without importing Tailwind itself, which would emit a second preflight over the consumer's.

_Recorded retroactively — this work predates Changesets being installed._
