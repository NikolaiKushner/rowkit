---
'rowkit': minor
---

**`Pagination` fits a phone.** Below 640px, «Back» and «Next» are drawn as arrows alone, so a row such as `◀ 1 … 39 40 41 … 100 ▶` no longer runs off a narrow screen. The words stay as the buttons' accessible names, and the switch is CSS, so nothing shifts as the page loads. The new `compact` prop sets it: `'auto'` (the default) below 640px, `true` always — for a narrow side panel on a wide screen — and `false` never, which keeps the previous look everywhere.
