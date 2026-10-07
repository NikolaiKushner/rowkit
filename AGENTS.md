# AGENTS.md

Instructions for coding agents working **on** rowkit.

> Looking for the API of the library itself? That is
> [`packages/ui/AGENTS.md`](./packages/ui/AGENTS.md) — generated from the source,
> shipped inside the npm package, and describing how to *use* the components.
> This file is about changing them.

A professional Vue 3 + TypeScript toolkit — the components a product interface is built from.

Repository: `github.com/NikolaiKushner/rowkit`
Package: `rowkit` on npm
Docs: `rowkit.dev`

## How to treat these rules

Every rule, ban and "decision already made" in this file is a default, not a
law. They exist to keep the library consistent, not to slow down a new
component, a change to an existing one, or the Windows 98 design.

- If a rule gets in the way of building something or of matching the Figma
  design, depart from it. Say so in one line in the commit or PR — which rule,
  and why it did not fit.
- If the same rule keeps getting in the way, change the rule in this file in
  the same PR rather than working around it again.
- The Figma design ([rowkit × Windows 98](https://www.figma.com/design/hmDfFpjrDP6WtEary6U6SE/rowkit-%C3%97-Windows-98)) wins over older wording here. When they disagree, follow the
  design and update the text.
- What stays firm: do not break a published API without a changeset, and do not
  ship something inaccessible or untested. Everything else bends.

## Read first

- **[`docs/conventions.md`](./docs/conventions.md)** — before designing anything
  with a public surface. Prop naming, state ownership, event and slot shapes,
  anatomy, and the recurring accessibility patterns are decided there, once,
  for every component.
- **[`ROADMAP.md`](./ROADMAP.md)** — the plan of record: where the library
  stands, what 1.0 requires, and the professional component set still to build.
  New surface belongs when a product interface is awkward without it. There is
  no fixed component count.

**Visual direction:** two themes from one set of components — **Windows 98**, the default, and **modern** (a current desktop OS look, light and dark; a draft until its Figma file exists). A theme is token values only: see [`docs/foundations/themes.md`](./docs/foundations/themes.md).

Windows 98: Grey `#C0C0C0` face, two-pixel bevels (raised, pressed, sunken), navy `#000080` selection and title-bar gradient, square corners, no soft shadows, no blur, next to no motion. PT Sans replaces Geist (OFL, Latin and Cyrillic, regular and bold; apps load the font, rowkit does not ship it). Controls follow Win98 sizes on desktop and grow to ≥ 24px touch targets on touch screens. Windows 98 has one light scheme; the modern theme has light and dark (`data-color-scheme`). The style, not the assets: no Microsoft logos, Windows flag or original system icons. Consumers still rebrand via tokens (`--color-primary-*`). Every component is redrawn; the pre-redesign look is legacy, not a reference.

## Stack

- **Own behaviour layer, no behaviour library.** Focus scope, dismissable layers, presence, scroll lock, hide-others and positioning live in `packages/ui/src/primitives/`, used by every component. Platform features where they are good enough (native inputs, `aria-live`); otherwise rowkit's own code. Extend a primitive, with its tests, rather than re-solving focus or dismissal inside a component.
- **Tailwind CSS v4** — configured via the `@theme` block in CSS. There is no `tailwind.config.js`.
- **Vitest** + **Storybook 10** (`@storybook/addon-vitest`, `@storybook/addon-a11y` as a gate, not a panel). Storybook 10, not 9: `@storybook/vue3-vite@9` peers on Vite 7 and this repo is on Vite 8.

## Rules

1. **No hardcoded design values.** Colour, space, radius, shadow, and z-index come from a token. If a token is missing, propose one.
   This includes how a theme draws a state. A component never names Windows 98 (or modern) in its classes: fills are role tokens (`bg-control`, `bg-checked`), sizes are size tokens (`h-control-md`), and structure that differs between themes is a style switch (`--rk-press-shift`, `focus-label` / `focus-ring` / `focus-outer`, `--rk-caption-order`). A new difference between themes is a new token in `packages/tokens`, with a value in every theme.
2. **Behaviour you own, you test.** Keyboard, focus and dismiss behaviour gets an interaction test, and `addon-a11y` stays a gate.
3. **Parts, composed by the consumer.** The consumer places the parts that change: root, trigger, content, title, description. Parts that always travel together — portal, overlay, close — belong inside `DialogContent`. A `mode` prop that redraws the layout is the thing to avoid. Details are in `docs/conventions.md`.
4. **`data-slot` on each public part**, kebab-cased (`dialog`, `dialog-title`), and `data-state` on parts that open and close.
5. **Variants live in one `ComponentName.variants.ts`**, defined with `cva`.
6. **Every prop has a JSDoc comment.** These feed the docs site and `packages/ui/AGENTS.md`.
7. **`vue` is external.** Never bundle the framework into the library output.
8. **Every public API change requires a changeset.** Rebuilding a component into parts is breaking. rowkit is in the 1.0 beta (changesets pre mode, `.changeset/pre.json`): every changeset publishes the next `1.0.0-beta.N` under the npm `beta` tag, so mark breaking changes `minor` and say so in the text. `pnpm changeset pre exit` before the release that should become 1.0.0.
9. **No `any`.** If typing is genuinely hard, ask rather than escaping the type system.
10. **Every public part accepts `class` and merges it** via `tailwind-merge`. A trigger the consumer restyles takes `as-child`.
11. **No competitor names in code.** Source, comments, tests, stories and docs pages do not mention Reka UI. Explain a design choice on its own terms ("a traced polygon would…"), not by contrast with another library. The only places it is named: changesets and this file. rowkit carries no code adapted from it — learn from how it behaves, then write the implementation yourself. If code from any MIT project is ever adapted, its license notice has to ship with the package: add a `THIRD_PARTY_NOTICES.md` and list it in `files`, never as a file header.

`Toaster` and `Field` are still single components. Leave them that way unless rebuilding one is the task.

## Component file structure

A single element (`Button`, `Badge`, `Input`, `Skeleton`, `EmptyState`) is one Vue file. An assembly is one folder: a file for each part the consumer places, and the parts that always travel together live inside `Content`. One variants module, one story file, one test file. `DataTable`, `FilterBar`, and `Pagination` stay widgets.

## Definition of done for a component

A component is not finished until all of these are true:

1. Renders all variants correctly in both themes, the modern one in light and dark
2. Full keyboard support, and that support is documented
3. `addon-a11y` passes with zero violations
4. All props typed and JSDoc'd
5. Stories cover every variant, every state, and — for an assembly — the parts composed by the consumer
6. Interaction test for the primary behavior
7. Docs page written, including a **"when not to use"** section
8. **Visual QA:** `pnpm visual:check <Component>` (Storybook must be running), then **Read the PNGs** and fix anything that looks wrong: blurred bevel edges, fractional pixels, an invisible focus rectangle. Switch the Theme and Scheme controls in the Storybook toolbar and look again. Green tests are not enough.

## How to work on this

- **One concern per session.** Don't start a second polish cluster before the first is done.
- **API before implementation.** When given a prop interface, build to it exactly. If the API is wrong, say so before writing code rather than silently changing it.
- **Ask before adding dependencies.** Every dependency is a maintenance cost and a bundle-size cost.
- **Don't scaffold ahead.** No placeholder files for components or parts that are not being built. Empty stubs rot.
- **Don't migrate in passing.** Turning `Dialog` or `Select` into parts is its own breaking change. Finish the task that was asked.
- **When reviewing, list problems without fixing them** unless asked. The maintainer decides what matters.
- **Look at the pixels.** After UI changes, screenshot and inspect. Do not claim "looks fine" from code alone.

## The competitor: Reka UI

[Reka UI](https://reka-ui.com) is rowkit's main competitor: the headless Vue behaviour library that Nuxt UI and shadcn-vue are built on, and that rowkit itself was built on before the Windows 98 redesign. Its source (MIT) is the best reference there is for how an accessible Vue component is put together — study it when designing a part: which edge cases its focus scope, dismissable layer, presence, popper or combobox handle. Then write rowkit's own; do not copy its code (rule 11).

Take how it is built; build it better. rowkit's versions already differ where Reka's were weak — Escape that reaches only the toast in focus, toasts ordered newest-first in the DOM instead of hidden focus proxies, one persistent live region, a tooltip that is its own description, a select written to the WAI-ARIA combobox pattern instead of a general engine with workarounds. Before building something it has, ask what it gets wrong. Do not add it back as a dependency, and keep its name out of code (rule 11).

## Design decisions already made

Settled for now. Revisit one when it gets in the way, with a reason — see "How to treat these rules":

- **npm package, not copy-paste distribution.** shadcn-vue's model is deliberate and good, but rowkit ships as a versioned package.
- **No behaviour library.** rowkit's primitives are its own. Nothing like Reka UI is ever added back as a dependency.
- **Assemblies are parts.** The consumer places root, trigger, content, and the text parts. Portal, overlay, and close can live inside content. See `docs/conventions.md`.
- **The set is the professional toolkit.** Components are added until a product interface can be built from rowkit. There is no fixed count, and tables are one part of that set, not the boundary of it.
- **MIT license.**
- **Tokens as a separate package**, so they can be consumed without importing components.
- **Two themes, by attribute.** `data-theme="win98" | "modern"` on any element (default Windows 98), `data-color-scheme` for the modern theme's dark. Each theme declares every value on its own element, so themes nest. No `dark:` variant and no `.dark` class.
- **The modern theme follows the designer's Figma file**; `design/integration.md` tracks what is integrated. Its icons are the designer's outline glyphs, exported from the file's Icons page into `packages/ui/src/icons/modern/` and drawn over the pixel icons with CSS masks (`pnpm icons:modern`).

## Commands

```bash
pnpm build        # run first in a fresh clone; workspace deps resolve through dist
pnpm test         # unit, component and browser tests
pnpm lint         # eslint, type-aware
pnpm typecheck    # vue-tsc, strict
pnpm format       # prettier
pnpm size         # bundle budget, brotli

pnpm storybook    # then, in another terminal:
pnpm visual:check # screenshot default stories → .visual-check/
pnpm visual:check Button  # scoped to one component

pnpm test:a11y:modern  # the browser tests and a11y gate in the modern theme
pnpm icons:modern     # regenerate the modern glyph CSS after changing src/icons/modern

pnpm docs:props   # regenerate the props tables after touching a prop or its JSDoc
pnpm docs:agents  # regenerate packages/ui/AGENTS.md, likewise
```

`pnpm build` before anything else is not optional. The playground, the docs and
the type checker all resolve `rowkit` through `packages/ui/dist`, and an unbuilt
workspace produces a wall of confusing type errors rather than one clear one.

After any change that touches variants, tokens, or layout: run
`pnpm visual:check`, **Read the PNGs**, and fix what looks wrong before claiming
done. Styling fails silently — screenshots are how agents catch it.

## Three things that are true here and not everywhere

**Backward compatibility matters.** rowkit is a published package with semver and
changesets, not an application. Breaking a public API is a deliberate act that
needs a major-version changeset and a reason, never a convenience taken while
doing something else. Generic agent guidance often says the opposite; it is wrong
for this repository.

**The failure mode is silence, not errors.** A Tailwind class that matches no
utility, a token in the wrong theme namespace, a `@source` path that resolves
nowhere, a slot prop named `name`: no error, no warning, wrong pixels. Verify
rendering and computed styles rather than assuming a green build means a correct
page. Several tests in `packages/ui/src/styles/` exist because of exactly this.

**Generated files are generated.** The props tables in `docs/components/*.md` and
`packages/ui/AGENTS.md` are derived from prop types and JSDoc. Editing them by
hand fails CI; run the command above and commit the result.

## Before opening a pull request

Everything in the definition of done above, plus a changeset for any public API
change:

```bash
pnpm changeset
```

Describe the change the way a consumer reading a changelog would want it
described — what changed and what it means for them, not which files moved.
