---
'@rowkit/tokens': minor
'rowkit': minor
---

**The tokens are now the Windows 98 design.** Every value comes from the Figma file's variables and styles.

- **Colour.** The primitives are the VGA palette and Windows 98's system colours as exact hex: `--color-vga-*` (`silver`, `gray`, `navy`, `teal`, …) and `--color-win98-*` (`light`, `dark-gray`, `title-blue`, `title-gray`, `info`). The OKLCH ramps (`neutral`, `primary`, `success`, `warning`, `danger`, `gray`, `red`, `green`, `amber`) and `colorSteps` are removed; `tokens.color.vga` and `tokens.color.win98` replace them. Semantic names are kept, and the design adds new ones: `desktop`, `tooltip-bg`, `text-disabled-emboss`, `on-selected`, `link`, `bevel-highlight` / `-light` / `-shadow` / `-dark`, and the `titlebar-*` gradient. `input` is now the white inside of a field, not a border colour.
- **Bevels instead of elevation.** `shadow-raised`, `window`, `raised-default`, `pressed`, `sunken`, `status`, `etched` and `raised-thin` replace `shadow-xs` … `shadow-xl`. A new `text-shadow-disabled` draws the embossed disabled text.
- **Square corners.** `--radius` defaults to `0rem`, so every `rounded-*` step is 0 until you set it; `rounded-full` is unchanged.
- **Type.** Sizes are named after the design's text styles: `text-ui` (11/13), `text-heading`, `text-mono`, `text-doc`, `text-doc-h1` / `-h2` / `-h3`. The `xs` … `3xl` sizes, the `medium` and `semibold` weights and the `tight` and `wide` tracking are removed (Tailwind's defaults still answer to those names). `--font-mono` now leads with VT323; load `@fontsource/vt323` next to `@fontsource/pt-sans`.
- **No backdrop blur.** The `blur` scale is removed, and the dialog backdrop no longer blurs.

In rowkit, a selected DataTable row now has white text on navy, and an outline Badge has black text, as in the design. The rest of the components move to the new look in the next releases.
