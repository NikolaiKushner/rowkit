---
'rowkit': minor
---

**rowkit no longer depends on Reka UI.** Every component now runs on rowkit's own primitives. Installing rowkit no longer pulls in `reka-ui`, `@floating-ui/*`, `@vueuse/*`, `aria-hidden` or `defu`, and the full library is about 22 kB brotli including dependencies, down from about 50 kB. If your app imported anything from `reka-ui` only because rowkit brought it in, add it to your own dependencies.
