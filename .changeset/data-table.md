---
'rowkit': minor
---

Add `DataTable` — column definitions constrained to the row type so a mistyped field is a compile error, per-column cell slots, sticky header, pinned columns with a scroll shadow, single-column sorting, and row selection with a tri-state select-all. Rows carry their own `id` rather than the table taking a `rowKey`, and sorting names a field of the row, so a sort referring to a column that does not exist also fails to compile.
