# Themes

rowkit ships two themes: **Windows 98**, the default, and **modern**, the look of
a current desktop operating system in light and dark. A theme is a set of
values for rowkit's tokens and nothing else. The components are the same;
their props, their markup and their behaviour do not change with the theme.

## Side by side

The same form, the same props, the same markup. Only `data-theme` changes.

<ThemesSideBySide />

## Switching

Put `data-theme` on any element — usually `<html>`. Without one, a page is
Windows 98.

```html
<html data-theme="modern"></html>
```

The modern theme follows the system's light or dark setting. Fix it with
`data-color-scheme` on the same element:

```html
<html data-theme="modern" data-color-scheme="dark"></html>
```

Themes nest. Every theme declares all of its values on its own element, so a
region marked `data-theme="win98"` inside a modern page is Windows 98, overlays
included when they are teleported inside it.

### Without a flash on load

If the theme is a user's choice, set the attribute before the page paints — an
inline script in `<head>`, ahead of the stylesheet:

```html
<script>
  try {
    const theme = localStorage.getItem('theme')
    if (theme) document.documentElement.dataset.theme = theme
  } catch {}
</script>
```

## Make it yours

The look is yours to change: colour, corners, density, typeface, shadows, how
focus and a pressed button are drawn, even the icons. Nothing about a theme is
reserved to rowkit — Windows 98 and modern are built with exactly the tools
below. There are three ways in, from smallest to largest:

| Way                                             | Good for                                                              | What you write           |
| ----------------------------------------------- | --------------------------------------------------------------------- | ------------------------ |
| [Adjust a theme](#adjust-a-theme)               | A brand colour, rounder corners, your typeface                        | A few CSS variables      |
| [Define your own theme](#define-your-own-theme) | A named theme of your own, light and dark, switchable like the others | One `defineTheme()` call |
| [Write a theme by hand](#write-a-theme-by-hand) | Full control without a build step                                     | One CSS rule per scheme  |

### Try it

Pick a base, an accent, corners, density and a typeface. The preview is drawn
in a theme that `defineTheme()` writes as you go — the same function and the
same CSS an app would ship — and the code under it is that theme.

<DemoBox>
  <ThemeBuilder />
</DemoBox>

### Adjust a theme

Most rebrands are a handful of values on top of one of the two themes. Set
them on the theme's own selector, in a stylesheet loaded after `rowkit/styles`:

```css
/* app.css */
@import 'tailwindcss';
@import 'rowkit/styles';

[data-theme='modern'] {
  --color-control-primary: #5b3df5;
  --color-control-primary-hover: #4c2fe0;
  --color-control-primary-active: #3f25c4;
  --color-surface-selected: #5b3df5;
  --color-checked: #5b3df5;
  --color-progress: #5b3df5;
  --color-focus-ring: #5b3df5cc;
  --radius-md: 10px;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

- **Windows 98 is the default, so it has two selectors.** Adjust it with
  `:root, [data-theme='win98'] { … }`.
- **The modern theme's dark scheme has its own rules.** A value the dark scheme
  also sets (the focus ring, the link colour, surfaces, text) needs repeating
  under `[data-theme='modern'][data-color-scheme='dark']` and the
  `prefers-color-scheme: dark` query. Once that is more than a line or two,
  define a theme instead: it writes those rules for you.
- **Use the theme's selector, not `:root`.** A variable whose value uses `var()`
  is resolved where it is declared. A theme declares its values on its own
  element, so a value set only on `:root` never reaches a `data-theme` region.
- **Shadows live in `--rk-shadow-*`.** `--rk-shadow-raised`, not
  `--shadow-raised`: Tailwind copies a shadow token's value into the utility,
  so `--shadow-*` only points at the variable a theme sets.

### Define your own theme

`defineTheme()` from `@rowkit/tokens` turns a few values into a complete theme:
it starts from Windows 98 or modern, lays your values over it, and writes the
stylesheet — every variable declared, both schemes, the dark one following the
system unless the page fixes it.

```js
// src/theme.js
import { defineTheme } from '@rowkit/tokens'

export const acme = defineTheme({
  name: 'acme',
  extends: 'modern',
  light: {
    '--color-control-primary': '#5b3df5',
    '--color-control-primary-hover': '#4c2fe0',
    '--color-control-primary-active': '#3f25c4',
    '--color-surface-selected': '#5b3df5',
    '--color-checked': '#5b3df5',
    '--color-focus-ring': '#5b3df5cc',
    '--radius-md': '10px',
    '--radius-lg': '14px',
    '--spacing-control-md': '36px',
    '--font-sans': "'Inter', system-ui, sans-serif",
  },
  dark: {
    '--color-control-primary': '#7c66ff',
    '--color-focus-ring': '#7c66ffcc',
  },
})
```

| Option    | What it does                                                                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`    | The theme's name: the page switches to it with `data-theme="acme"`. Lowercase letters, digits and dashes.                                                                                        |
| `extends` | `'modern'` (default) or `'win98'`. Every value you do not set comes from it — including its style: rings or dotted rectangles, bevels or shadows.                                                |
| `light`   | Your values for the light scheme, or for the only scheme of a theme without a dark one.                                                                                                          |
| `dark`    | What changes in the dark scheme, on top of `light`. A theme built on `modern` inherits modern's dark scheme; `dark: false` gives it none. A theme built on `win98` has none unless you pass one. |

It checks what it is given: a token rowkit does not have (`'--color-brnad'`)
throws, so a typo fails the build instead of quietly doing nothing.

**Ship the CSS** in one of two ways.

At build time — a script that writes a stylesheet you import after
`rowkit/styles`:

```js
// scripts/build-theme.mjs — run it before your build
import { writeFile } from 'node:fs/promises'
import { acme } from '../src/theme.js'

await writeFile('src/styles/acme.css', acme)
```

```css
/* app.css */
@import 'tailwindcss';
@import 'rowkit/styles';
@import './styles/acme.css';
```

Or at run time — inject it once, early, before the themed content renders:

```ts
// main.ts
import { acme } from './theme.js'

const style = document.createElement('style')
style.textContent = acme
document.head.append(style)
```

**Then switch to it** like any other theme:

```html
<html data-theme="acme"></html>
```

### Light and dark

A theme with a dark scheme follows the system's setting. To let people choose,
set `data-color-scheme` on the same element as `data-theme`:

| Attribute                   | Scheme                             |
| --------------------------- | ---------------------------------- |
| _(none)_                    | the system's light or dark setting |
| `data-color-scheme="light"` | always light                       |
| `data-color-scheme="dark"`  | always dark                        |

Each scheme also sets the CSS `color-scheme`, so native controls, scroll bars
and form autofill follow it.

### Switching at run time

Themes are attributes, so switching is a line of code. A composable that
remembers the choice:

```ts
// useTheme.ts
import { ref, watchEffect } from 'vue'

type Theme = 'win98' | 'modern' | 'acme'
type Scheme = 'system' | 'light' | 'dark'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme | null) ?? 'modern')
const scheme = ref<Scheme>((localStorage.getItem('scheme') as Scheme | null) ?? 'system')

watchEffect(() => {
  const root = document.documentElement
  root.dataset.theme = theme.value
  if (scheme.value === 'system') delete root.dataset.colorScheme
  else root.dataset.colorScheme = scheme.value
  localStorage.setItem('theme', theme.value)
  localStorage.setItem('scheme', scheme.value)
})

export const useTheme = () => ({ theme, scheme })
```

Pair it with the [inline script](#without-a-flash-on-load) so a reload opens in
the chosen theme. A part of the page can have its own theme too: put
`data-theme` on its container.

### Write a theme by hand

Without a build step, a theme is a CSS rule that declares every rowkit
variable. Start from the rule for the theme closest to yours — copy
`[data-theme="modern"] { … }` out of `node_modules/@rowkit/tokens/dist/tokens.css`
— rename the selector and change what you need:

```css
[data-theme='acme'] {
  color-scheme: light;
  --color-background: #f7f7fb;
  --color-control-primary: #5b3df5;
  /* …every other variable, as copied… */
}

@media (prefers-color-scheme: dark) {
  [data-theme='acme']:not([data-color-scheme='light']) {
    color-scheme: dark;
    /* the dark values */
  }
}

[data-theme='acme'][data-color-scheme='dark'] {
  color-scheme: dark;
  /* the same dark values */
}
```

Declare every variable, not only the ones you change: a variable left out
inherits from whatever theme surrounds the region, which is not what you want
from a theme. The same values are available as data —
`tokens.themes.win98`, `tokens.themes.modern.light` and `.dark` — if you would
rather generate the rule yourself; `themeRule(selector, scheme, values)` writes
one.

## What you can change

Every value a component draws with, in six groups. Values for both themes are on
[Tokens](/foundations/tokens).

| Group          | Variables              | Examples                                                                                                                                                                                                                                           |
| -------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colours        | `--color-*`            | Surfaces (`background`, `card`, `input`, `popover`), text (`foreground`, `muted-foreground`, `text-subtle`), roles (`control`, `control-primary`, `checked`, `table-header`, `caption-close`), status families (`danger-solid`, `success-subtle`…) |
| Shadows        | `--rk-shadow-*`        | `raised` (a button's edge), `raised-default` (the default button's), `pressed`, `sunken` (a field), `window`, `popover`, `table`, `header`, `checked`, `field-button`, `caption`, `titlebar`, `statusbar`, `scroll-thumb`                          |
| Sizes          | `--spacing-<name>`     | `control-xs` … `control-lg`, `icon-*`, `row-sm`, `row-md`, `check`, `radio`, `item`, `titlebar`, `caption-w`, `caption-h`, `frame`, `scrollbar`, `progress`                                                                                        |
| Corners        | `--radius-*`           | `xs` (check box), `sm` (menu item), `md` (button, field), `lg` (list, table), `xl` (window), `pill` (badge, chip, progress)                                                                                                                        |
| Type           | `--font-*`, `--text-*` | `--font-sans`, `--font-mono`, `--text-ui` and `--text-ui--line-height`, `--text-heading`, `--text-mono`, `--font-weight-strong`                                                                                                                    |
| Style switches | `--rk-*`               | How a state is drawn — next table                                                                                                                                                                                                                  |

Style switches are what make a theme a style and not only a palette. Each one
is a plain CSS value:

| Switch                                                   | What it decides                                                | Windows 98        | Modern               |
| -------------------------------------------------------- | -------------------------------------------------------------- | ----------------- | -------------------- |
| `--rk-focus-label-width`                                 | The dotted ring around a control's label                       | `1px`             | `0px`                |
| `--rk-focus-outer-width`, `--rk-focus-outer-offset`      | The ring around a control's edge                               | `0px`             | `3px`, `0px`         |
| `--rk-focus-ring-width`, `--rk-focus-ring-style`         | The ring on a focused row, region or toast                     | `1px dotted`      | `2px solid`          |
| `--rk-press-shift`                                       | How far a held button's label moves                            | `1px`             | `0px`                |
| `--rk-press-brightness`                                  | Brightness of a held caption button                            | `1`               | `0.85`               |
| `--rk-dither-image`                                      | Pattern on a latched toggle and a scroll track                 | checker           | `none`               |
| `--rk-loading-image`, `--rk-animate-loading`             | A skeleton's pattern and motion                                | checker, stepping | `none`, pulse        |
| `--rk-duration-control`                                  | How long a control takes to change state                       | `0ms`             | `120ms`              |
| `--rk-animate-overlay-in`                                | How a dialog, list or toast arrives                            | `none`            | fade and scale       |
| `--rk-overlay-bg`                                        | What a modal dialog lays over the page                         | `transparent`     | 15% black            |
| `--rk-popover-backdrop`                                  | Backdrop filter behind a dropped list                          | `none`            | blur and saturate    |
| `--rk-etch-width`                                        | The light second line of a separator                           | `1px`             | `0px`                |
| `--rk-caption-order`, `--rk-close-order`                 | Caption buttons after or before the title; close last or first | `0`, `0`          | `-1`, `-1`           |
| `--rk-titlebar-align`, `--rk-titlebar-balance`           | Title at the start or centred, and the space that centres it   | `start`, `0px`    | `center`, `60px`     |
| `--rk-caption-glyph-opacity`                             | Caption glyphs at rest (hover shows them)                      | `1`               | `0`                  |
| `--rk-scrollbar-buttons`                                 | Arrow buttons on a scroll bar                                  | `block`           | `none`               |
| `--rk-glyph-scale`                                       | Scale of small glyphs: a check mark, a caption glyph           | `1`               | `1.4`                |
| `--rk-radio-fill`, `--rk-radio-dot-r`, `--rk-radio-edge` | An option button drawn by CSS instead of pixels                | `0%`              | `100%`, `3px`, `1px` |
| `--rk-icon-pixels`, `--rk-icon-fill`, `--rk-icon-tone-*` | Pixel icons, or outline glyphs and their colours               | pixels            | glyphs               |

### Icons

rowkit's icons are Windows 98 pixel art, and every one is an `<svg data-icon>`.
A theme does not swap the components to change them: it hides the pixels and
paints a glyph over the same box with a CSS mask.

- **Keep the pixel icons:** `--rk-icon-pixels: inline; --rk-icon-fill: transparent`
  (what Windows 98 sets).
- **Use the outline glyphs:** `--rk-icon-pixels: none; --rk-icon-fill: currentColor`,
  and `--rk-icon-tone-danger`, `-warning`, `-info`, `-success`, `-folder` for the
  ones that keep a colour (what modern sets — a theme extending modern has it).
- **Draw your own:** set `--rk-icon-<name>` on your theme's selector to an SVG
  `url()`; the names are the icons' `data-icon` values, such as `search`,
  `error-32` or `check-glyph`. The SVG is used as a mask: its shape counts, not
  its colour.

```css
[data-theme='acme'] {
  --rk-icon-search: url('/icons/acme-search.svg');
  --rk-icon-error: url('/icons/acme-error.svg');
}
```

### Check your theme

rowkit holds its own themes to WCAG AA in its test suite, and yours should meet
the same bar:

- **Text, 4.5:1:** `foreground` on `background`, `card`, `input` and
  `popover`; `control-primary-foreground` on `control-primary` and its hover
  and active fills; `on-selected` on `surface-selected`; each `*-on-solid` on
  its `*-solid` and each `*-on-subtle` on its `*-subtle`; `text-subtle` on
  `input`.
- **Edges and state, 3:1:** `border-strong` (a field's edge) on `input` and
  `card`; `on-checked` on `checked`; `progress` on `track`; `focus-ring` on
  `background` and `card`.

An accent picked for brand reasons often fails as a background for white text;
darken `control-primary` until it passes rather than lightening the text.

## When not to use

- **Do not theme by overriding component classes.** A `class` on a component
  merges and wins, but it is per instance; a theme is per page. Tokens are the
  one place a look changes everywhere.
- **Do not reach for `dark:`.** There is no dark class; a theme's dark scheme
  is `data-color-scheme`, and the components already follow it.
