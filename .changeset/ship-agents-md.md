---
'rowkit': patch
---

Ship `AGENTS.md` inside the package.

After installing, `node_modules/rowkit/AGENTS.md` describes every component's
props, `v-model`s, events and slots — including `DataTable`'s per-column
`#cell:<key>` slot and the full shape of its slot props — plus the setup steps
that are not visible in a type, such as the `rowkit/styles` import without which
everything renders unstyled.

It is generated from the source, so it describes the version installed rather
than whatever was current when it was written. A coding agent working in your
project can read it without fetching anything.
