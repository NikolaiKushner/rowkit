---
'rowkit': minor
'@rowkit/tokens': minor
---

**`rowkit/theme`: make a theme of your own with nothing else to install.** `import { defineTheme } from 'rowkit/theme'` gives you `defineTheme()`, `themeRule()` and the themes' values from the tokens rowkit itself depends on, so the theme always matches the components you render. A pnpm project could not import `@rowkit/tokens` without adding it to its own dependencies, at a version that could drift from rowkit's; it no longer needs to. `@rowkit/tokens` keeps the same functions for projects that use the tokens without the components.

- **Theme values are typed by token name.** `defineTheme()` takes `ThemeValues`: every variable a theme may set, by name (`ThemeTokenName`), so an editor completes them and a typo such as `'--color-brnad'` fails the type check, not only the run. Values built at run time as a plain record are still accepted, and an unknown name still throws.
