---
'rowkit': minor
---

**`Select` is rebuilt on the WAI-ARIA combobox pattern, without Reka UI.** Released as a `minor` while rowkit is on 0.x, because the markup changes.

- Same parts and props (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`), same `v-model`, `searchTerm`, `searchable`, `manualFilter`.
- **Type-ahead:** in a non-searchable select, typing the start of a label opens the list and highlights the match.
- **Above dialogs:** the list paints at `z-popover`, so a select inside a `Dialog` no longer opens underneath it.
- **Positioning:** the list opens below the control, or above it when there is no room below.
- `aria-activedescendant` exists only while the list is open, natively — no workaround.
- Search matching ignores case and accents in the user's locale.
- The width custom property is now `--rk-select-trigger-width` (was `--reka-combobox-trigger-width`).
