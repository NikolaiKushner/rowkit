---
'rowkit': minor
'@rowkit/tokens': minor
---

**A second theme: modern, in light and dark.** Put `data-theme="modern"` on `<html>` (or any element) and rowkit draws the look of a current desktop operating system — white and grey surfaces, a blue accent, rounded corners, soft shadows, a ring around the focused control, short transitions and outline icons. It follows the system's dark setting; `data-color-scheme="light"` or `"dark"` fixes it. Without an attribute, nothing changes: Windows 98 is still the default and draws exactly as before. The modern theme's values are a draft until its design is finished; they will change, your code will not.

- **Every component now reads its look from tokens.** New role colours (`control`, `control-primary`, `checked`, `popover`, `table-header`, `track`, `caption-*` and more), size tokens in the spacing namespace (`h-control-md`, `size-check`, `h-row-md`), a `pill` radius, a `strong` font weight, and `--rk-*` style switches for how a theme draws a state. Themes nest: a `data-theme="win98"` region inside a modern page is Windows 98.
- **Shadow tokens are now variables a theme can set.** `--shadow-*` in `@theme` points at `--rk-shadow-*`, which holds the value. If you override a shadow, override `--rk-shadow-<name>`.
- **New utilities in `rowkit/styles`:** `focus-label`, `focus-ring`, `focus-outer`, `bg-loading`, and `scrollbar-themed` (`scrollbar-win98` still works).
- **Icons carry `data-icon`**, and the stylesheet includes the modern theme's outline glyphs (Lucide, ISC — see `THIRD_PARTY_NOTICES.md`), applied by CSS only inside that theme.
- **Make a theme of your own with `defineTheme()`** from `@rowkit/tokens`: start from `modern` or `win98`, set the values you change, get the whole stylesheet — both schemes included. It refuses a token that does not exist. `themeRule()` writes a single rule.
- **`@rowkit/tokens` exports the themes as data:** `tokens.themes.win98`, `tokens.themes.modern.light` and `.dark`, plus `size`, `style` and the modern palette.
- **Fixed: `ScrollArea` assumed 16px arrow buttons** when sizing its thumb; it reads the theme's.
