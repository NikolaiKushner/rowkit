---
'rowkit': patch
'@rowkit/tokens': patch
---

Add a README to each package.

Both npm pages were blank. npm publishes the README that sits beside
`package.json`, not the one at the root of a monorepo — so the repository README
was never reaching the surface that matters most for a package nobody has heard
of yet.

Each package now has its own, aimed at someone deciding whether to install it:
the setup step people miss, a typed `DataTable` example, and what the library
deliberately is not.
