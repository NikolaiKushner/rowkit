# Installation

```bash
pnpm add rowkit
```

`vue` and `tailwindcss` are peer dependencies — rowkit uses the copies you
already have. Bundling either causes duplicate-instance bugs that are miserable
to diagnose.

## The setup step you cannot skip

Two lines in your stylesheet:

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

**Order matters, and both lines are required.** Tailwind only generates CSS for
classes it can see, and it does not scan `node_modules`. `rowkit/styles`
registers the shipped bundle as a source so Tailwind finds rowkit's utilities as
part of _your_ build — which is why the output contains only the classes your app
actually renders.

Note there is no `.css` on either subpath. The export is `rowkit/styles`.

## Dark mode

Add the `dark` class to `<html>`. rowkit's tokens key off the class, not
`prefers-color-scheme`, so you control when the theme flips:

```ts
document.documentElement.classList.toggle('dark', isDark)
```

Only semantic tokens change under `.dark`; the colour primitives stay fixed. A
component never knows which theme is active — it reads `--color-card` and the
answer differs.

## Nuxt

`nuxt.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: {
    // Tailwind v4 has no Nuxt module; the Vite plugin is the supported path.
    plugins: [tailwindcss()],
  },
})
```

`assets/css/main.css` gets the two lines from above.

### Overlays under SSR

Portals do not exist server-side. Reka defers teleport mounting until the client,
so `Dialog` and `Tooltip` need nothing extra.

`Toaster` holds a module-level queue, which is not per-request safe on the
server. Wrap it:

```vue
<ClientOnly>
  <Toaster />
</ClientOnly>
```

Calls to `toast()` before the client mounts are queued rather than dropped.

> **You do not need `provideSSRWidth`.** Advice to add a VueUse SSR-width plugin
> circulates for Reka-based apps and does not apply to rowkit on Reka 2.10: the
> only viewport read in the library's dependency tree is a
> `matchMedia('(pointer:coarse)')` pointer check, already guarded for SSR. If a
> future Reka version introduces responsive behaviour that needs it, this section
> is where it will be documented.

## Troubleshooting

### Components render unstyled

The single most common problem, and almost always the missing `@import
'rowkit/styles'`. Check, in order:

1. Both `@import` lines are present, Tailwind first.
2. The subpath has no `.css` suffix — `rowkit/styles`, not `rowkit/styles.css`.
3. Your stylesheet is actually loaded (Nuxt's `css:` array, or an import in your
   entry).
4. Tailwind v4, not v3. The `@theme` block and `@source` are v4-only, and v3
   silently ignores both.

There is no runtime warning for this by design — rowkit cannot detect that
Tailwind did not generate its classes.

### Components render unstyled in StackBlitz or a sandboxed editor

`@source` pointing into `node_modules` has known edge cases where the sandbox's
filesystem is virtualised, and there is nothing rowkit can do about it from
inside the package.

rowkit does **not** currently ship a precompiled stylesheet — the distribution
model is "the consumer's Tailwind compiles it", chosen deliberately so there is
never a second set of Tailwind output fighting yours. A precompiled build is
additive and on the roadmap, not built. Until then: reproduce locally, or add
rowkit's dist to your own `@source` list explicitly.

### `Cannot find module 'rowkit/styles'`

Older bundler resolution ignoring the `exports` map. Ensure your bundler
supports package exports (Vite 5+, webpack 5+) and that TypeScript is on
`"moduleResolution": "bundler"`.

### Utilities like `z-modal` or `duration-fast` do nothing

These are token-backed utilities and need `rowkit/styles` imported. If they still
produce nothing, the token CSS has not been picked up — confirm
`@rowkit/tokens` resolved, since `rowkit/styles` imports it.

### Dark mode does not switch

rowkit keys off the `.dark` class rather than `prefers-color-scheme`. Setting the
OS preference alone does nothing; the class has to be on `<html>`.

## Tokens without components

`@rowkit/tokens` stands alone, for a docs site or anything that needs the values
without importing a Vue component:

```ts
import { tokens } from '@rowkit/tokens'
```

The TypeScript object and the `@theme` CSS are generated from one source, so they
cannot drift.
