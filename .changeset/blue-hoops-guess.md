---
'@rowkit/tokens': minor
'rowkit': patch
---

Keep the rule under a sticky table header while the body scrolls.

A border could never do this job. Under `border-collapse` a border belongs to the table's grid rather than to any cell, so a `position: sticky` header leaves its own line behind and scrolls away from it — the rows then slide under a header with nothing between them, which is the one thing a sticky header exists to prevent. It read as the header losing its edge when scrolled and regaining it at the top.

New `shadow-sticky-header` token: an inset shadow, which belongs to the element and travels with it. It is a token rather than an arbitrary value because it carries `var(--color-border)` and has to keep it through Tailwind's shadow-colour handling, or the line renders in the light-mode colour under `.dark`.

Two gates: the compile test asserts the utility resolves with the variable intact, and the sticky-header story scrolls its own container and measures that the header is still pinned, still opaque, and still painting a shadow. Swapping the shadow back for a border fails the second one.
