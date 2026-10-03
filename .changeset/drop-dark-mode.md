---
'@rowkit/tokens': minor
'rowkit': minor
---

**Breaking: dark mode is removed.** rowkit now has a single theme, the first step of the Windows 98 redesign. This is a breaking change released as a `minor` while rowkit is on 0.x.

- The token stylesheet no longer emits a `.dark` block or redefines Tailwind's `dark:` variant. Setting `class="dark"` on `<html>` now does nothing; remove any theme toggle that relied on it. `dark:` utilities in your own code fall back to Tailwind's default `prefers-color-scheme` behaviour.
- `semanticColorDark` and the `whiteAlpha` primitives (`--color-white-alpha-*`) are removed from `@rowkit/tokens`.
- `semanticColorLight` is renamed to `semanticColor`, and `tokens.color.semantic` is now that map directly rather than `{ light, dark }`. Replace `tokens.color.semantic.light` with `tokens.color.semantic`.
