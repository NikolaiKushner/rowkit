---
'rowkit': patch
'@rowkit/tokens': patch
---

Fix types failing to resolve under `moduleResolution: node16` and `nodenext`.

The emitted declarations carried extensionless relative specifiers — `from
'./components/Badge'`, `from './Badge.variants'` — and a directory import cannot
be resolved by Node's ESM resolver. Anyone on `bundler` (Vite, Nuxt) was
unaffected; everyone else saw the package as untyped.

The build now rewrites those specifiers to end in `.js`. No API change, and the
JavaScript output is untouched.
