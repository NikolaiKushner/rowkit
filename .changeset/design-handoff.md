---
'rowkit': minor
'@rowkit/tokens': minor
---

**The modern theme now follows its finished design.** Badges, fields, dialogs, empty states, filter chips, the pager, status bars, toasts, tables, group boxes and selects take the designer's sizes and colours; each difference is a token, so Windows 98 is unchanged.

- **`ProgressBar` without a `value` is indeterminate.** Leave `value` out, or pass `null`, while the amount of work is unknown: a segment travels along the track (`--rk-animate-progress`), and with reduced motion it stands still. `aria-valuenow` is left off, as ARIA asks.
- **Select options show a check mark** beside the selected one, in every theme, as the design draws it. The read-only value is no longer highlighted while the list is open, and the drop button stays pressed in until it closes.
- **Pagination keeps the rows-per-page control beside the page buttons**, at the end of the row, as the design places it.
- **New tokens:** colours `table-row-hover`, `field-caret`, `field-highlight`, `on-field-highlight`, `control-primary-latched`, `filter-bar`, `chip`, `chip-border`, `chip-foreground`, `chip-remove`, `pager`, `pager-hover`, `pager-active`, `toast-close`, `toast-close-foreground`; shadows `latched-ghost`, `field-button-pressed`, `pager`, `pager-focus`, `pager-pressed`, `toast-close`, `checked-selected`; sizes for badges, dialogs, empty states, fields, filter bars, pagers, status bars, tables, toasts and select options; style switches `--rk-empty-direction`, `--rk-empty-align`, `--rk-footer-direction`, `--rk-invalid-width`, `--rk-field-error-align`, `--rk-link-decoration`, `--rk-legend-weight`, `--rk-titlebar-icon`, `--rk-animate-progress`.
- **Modern, dark:** destructive text is brighter (`#ffa0a4`, 4.7:1 on a control).
