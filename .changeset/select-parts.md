---
'rowkit': minor
---

**Breaking (Select).** `Select` is now a set of parts. The `options` prop is gone, and so are the `option`, `value`, and `empty` slots on `Select`.

Place `SelectTrigger`, `SelectContent`, and a `SelectItem` for each choice. `placeholder`, `size`, `id`, and `class` move to `SelectTrigger`. `emptyText`, `loading`, and `loadingText` move to `SelectContent`. `searchable`, `manualFilter`, `disabled`, `invalid`, `required`, and `name` stay on `Select`. `v-model` and `v-model:searchTerm` are unchanged. `label` on `SelectItem` is what the closed trigger shows.
