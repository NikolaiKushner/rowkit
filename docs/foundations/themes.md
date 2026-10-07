# Themes

rowkit ships two themes: **Windows 98**, the default, and **modern**, the look of
a current desktop operating system in light and dark. A theme is a set of
values for rowkit's tokens and nothing else. The components are the same;
their props, their markup and their behaviour do not change with the theme.

<DemoBox>
  <div class="grid gap-4 md:grid-cols-2">
    <div data-theme="win98" class="flex flex-col gap-3 bg-background p-4">
      <Field label="Name"><Input placeholder="Ada Lovelace" /></Field>
      <Checkbox label="Send me updates" :model-value="true" />
      <div class="flex gap-1.5"><Button>Save</Button><Button variant="secondary">Cancel</Button></div>
    </div>
    <div data-theme="modern" data-color-scheme="light" class="flex flex-col gap-3 rounded-lg bg-background p-4">
      <Field label="Name"><Input placeholder="Ada Lovelace" /></Field>
      <Checkbox label="Send me updates" :model-value="true" />
      <div class="flex gap-1.5"><Button>Save</Button><Button variant="secondary">Cancel</Button></div>
    </div>
  </div>
</DemoBox>

::: warning The modern theme is a draft
Its values are assembled from platform guidelines so the theme can be built,
tested and reviewed in code. The designed version replaces them value for value;
nothing in your code changes when it does.
:::

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

## What a theme sets

Everything a component draws comes from a token, in five groups. The full list,
with both themes' values, is on [Tokens](/foundations/tokens).

| Group          | Variables                                     | What changes between themes                                                                                                                            |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Colours        | `--color-*`                                   | Surfaces, text, and roles such as `control`, `control-primary`, `checked`, `popover`, `table-header`                                                   |
| Shadows        | `--rk-shadow-*`                               | Bevels in Windows 98; hairlines and soft shadows in modern                                                                                             |
| Sizes          | `--spacing-control-md`, `--spacing-row-md`, … | Control heights, rows, title bars, checkboxes                                                                                                          |
| Radii          | `--radius-*`, `--radius-pill`                 | Square in Windows 98                                                                                                                                   |
| Style switches | `--rk-*`                                      | How a state is drawn: the dotted ring around a label or a ring around the control, the 1px press shift, the dither, the caption buttons' order, motion |

Two things are worth knowing when you override them:

- **Shadows live in `--rk-shadow-*`, not `--shadow-*`.** Tailwind copies a
  shadow token's value into the utility, so the `@theme` token is only a pointer
  to the variable a theme sets.
- **Override on the theme's element, not on `:root` alone.** A variable whose
  value uses `var()` is resolved where it is declared. Repointing a primitive on
  `:root` does not reach a semantic token a theme has already declared on
  `[data-theme]`.

### Icons

rowkit's icons are Windows 98 pixel art. The modern theme does not swap the
components: it hides an icon's pixels and paints its own outline glyph over the
same box with a CSS mask, keyed by the icon's `data-icon`. A theme of your own
can do the same with `--rk-icon-pixels`, `--rk-icon-fill` and one
`--rk-icon-<name>` per glyph.

## Your brand on a theme

Most rebrands are a handful of colours on top of one of the two themes:

```css
[data-theme='modern'] {
  --color-control-primary: #5b3df5;
  --color-control-primary-hover: #4c2fe0;
  --color-control-primary-active: #3f25c4;
  --color-surface-selected: #5b3df5;
  --color-checked: #5b3df5;
  --color-focus-ring: #5b3df5cc;
  --radius-md: 10px;
}
```

Load it after `rowkit/styles`. For contrast, every pair a component paints is
listed in `packages/tokens/src/contrast.test.ts`; check your colours against
the same pairs.

## A theme of your own

A complete theme sets every value Windows 98 sets. The token package exports
each theme as data, so a theme can start from one and change what it needs:

```ts
import { tokens } from '@rowkit/tokens'

tokens.themes.win98 // every variable, at its Windows 98 value
tokens.themes.modern.light // the modern theme
tokens.themes.modern.dark // what the dark scheme changes
```

Write the result as a rule on `[data-theme='your-name']`, with `color-scheme`
set, and switch to it like the others.

## When not to use

- **Do not theme by overriding component classes.** A `class` on a component
  merges and wins, but it is per instance; a theme is per page. Tokens are the
  one place a look changes everywhere.
- **Do not reach for `dark:`.** There is no dark class; a theme's dark scheme
  is `data-color-scheme`, and the components already follow it.
