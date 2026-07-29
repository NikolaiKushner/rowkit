---
'rowkit': minor
---

Add the styling foundation: the `cn` class-merge utility and the `rowkit/styles`
entry point.

`cn` wraps `tailwind-merge` extended with rowkit's own scales — shadows,
z-index layers, motion durations and easings — read from the token package, so
a new token cannot fall out of sync with the merge rules. Without it,
`shadow-scroll-x` and `z-modal` survive a merge as duplicate classes.

`rowkit/styles` declares the token theme and registers the shipped bundle as a
Tailwind source. It deliberately does not import Tailwind itself: a library that
does emits a second copy of preflight over the consumer's own. Consumers write:

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

_Recorded retroactively — this work predates Changesets being installed._
