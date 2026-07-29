---
'rowkit': minor
---

Export a props type for every component — `ButtonProps`, `SelectProps<T>`, `DataTableProps<TRow>` and the rest — so a consumer can annotate a wrapper without restating the surface by hand. Each lives in the component's `types.ts`, since `<script setup>` cannot export a type, and `defineProps` now references it rather than an inline literal.
