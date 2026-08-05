---
'rowkit': minor
---

Move controls to the tighter of the two size scales the reference ships, and add `xs` and icon buttons.

The default control is now 32px rather than 36px, with 10px of horizontal padding rather than 16px, and `rounded-lg`:

| size | button | input / select |
| ---- | ------ | -------------- |
| `xs` | 24px   | —              |
| `sm` | 28px   | 28px           |
| `md` | 32px   | 32px           |
| `lg` | 36px   | 36px           |

A denser bar of controls is what a page built around a table wants, and it is the scale the reference's own newer style uses.

New `icon` prop renders a button square, sized from its `size` — a row of icon buttons is a row of squares instead of a ragged line, and the padding presets would otherwise leave a lone glyph off-centre. Supply the accessible name yourself; nothing here does.

Bare `<svg>` children are now sized automatically, and skipped when the caller has already said what size they want. An icon with no intrinsic size collapses in a flex row, which is a tedious thing to rediscover per call site.
