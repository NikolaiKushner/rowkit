---
'rowkit': patch
'@rowkit/tokens': patch
---

Fix the exported `version` constant reporting `0.0.0` on a released build.

Both packages exported a hand-written literal that a test pinned against
`package.json`. Changesets bumps the manifest and nothing updated the literal,
so the first release failed its own test — and had it passed, `version` would
have reported `0.0.0` from a `0.1.0` package.

It is now read from `package.json` directly, so the two cannot disagree. Rollup
tree-shakes the import down to the single string; nothing else from the manifest
ships.
