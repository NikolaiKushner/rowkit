---
'@rowkit/tokens': minor
'rowkit': minor
---

Rename the core semantic tokens to shadcn/ui's names.

**Breaking for anyone who overrides tokens or writes rowkit utility classes directly.** Components are unaffected — no prop, slot or event changes.

| before                   | after                      |
| ------------------------ | -------------------------- |
| `--color-surface`        | `--color-card`             |
| `--color-surface-subtle` | `--color-muted`            |
| `--color-surface-hover`  | `--color-accent`           |
| `--color-text`           | `--color-foreground`       |
| `--color-text-muted`     | `--color-muted-foreground` |
| `--color-border-control` | `--color-input`            |
| `--color-focus-ring`     | `--color-ring`             |

Utility classes follow: `bg-surface` → `bg-card`, `text-text-muted` → `text-muted-foreground`, `border-border-control` → `border-input`, `ring-focus-ring` → `ring-ring`.

These seven map one-to-one onto shadcn's, which is the point: if you have themed shadcn/ui, you already know how to theme rowkit.

**Renamed, and no further.** `surface-active`, `surface-selected`, `surface-disabled`, `skeleton`, `text-subtle`, `text-disabled`, `border-strong` and `border-subtle` keep their names because shadcn has no equivalent, and collapsing them all into `muted-foreground` would delete real states — a pressed row and a selected row would become one token. The status families (`primary-solid`, `danger-subtle`, `warning-on-solid`, …) keep theirs because shadcn's flat `--primary` carries no solid/subtle/outline axis, and Badge and Button expose exactly that axis as a prop; renaming them would mean redesigning those APIs.

Also in this release: the shadcn attribution line is now in all three READMEs, and the bundle budget is re-verified at 12.29 kB against a 14 kB limit — the restyle moved it by class churn only.
