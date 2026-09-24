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

## Read first

- **[`docs/conventions.md`](./docs/conventions.md)** — before designing anything
  with a public surface. Prop naming, state ownership, event and slot shapes,
  anatomy, and the recurring accessibility patterns are decided there, once,
  for every component.
- **[`ROADMAP.md`](./ROADMAP.md)** — the plan of record: where the library
  stands, what 1.0 requires, and the professional component set still to build.
  New surface belongs when a product interface is awkward without it. There is
  no fixed component count.

**Visual direction:** restraint, structure without severity, no excess. Neutral chrome; ink-blue primary (`oklch(0.32 0.09 255)`), not a chromatic shout. Consumers rebrand via tokens — defaults must not fight them. Geist stays.

## Stack

- **Reka UI** — accessible primitives. NEVER hand-roll focus management, ARIA wiring, or keyboard handling when a Reka primitive exists.
- **Tailwind CSS v4** — configured via the `@theme` block in CSS. There is no `tailwind.config.js`.
- **Vitest** + **Storybook 10** (`@storybook/addon-vitest`, `@storybook/addon-a11y` as a gate, not a panel). Storybook 10, not 9: `@storybook/vue3-vite@9` peers on Vite 7 and this repo is on Vite 8.

## Rules

1. **No hardcoded design values.** Colour, space, radius, shadow, and z-index come from a token. If a token is missing, propose one.
2. **Behaviour comes from Reka.** Forward the primitive with `useForwardPropsEmits`. Do not reimplement focus, dismiss, typeahead, or scroll lock.
3. **Follow Reka's custom API.** The consumer places the parts that change: root, trigger, content, title, description. Parts that always travel together — portal, overlay, close — belong inside `DialogContent`, which is what Reka's own docs show. A `mode` prop that redraws the layout is the thing to avoid. Details are in `docs/conventions.md`.
4. **`data-slot` on each public part**, kebab-cased (`dialog`, `dialog-title`). `data-state` comes from Reka.
5. **Variants live in one `ComponentName.variants.ts`**, defined with `cva`.
6. **Every prop has a JSDoc comment.** These feed the docs site and `packages/ui/AGENTS.md`.
7. **`vue` is external.** Never bundle the framework into the library output.
8. **Every public API change requires a changeset.** Rebuilding a component into parts is breaking. On 0.x, mark that changeset `minor` and say so in the text — a `major` here publishes 1.0.0.
9. **No `any`.** If typing is genuinely hard, ask rather than escaping the type system.
10. **Every public part accepts `class` and merges it** via `tailwind-merge`. A trigger the consumer restyles takes `as-child`.

`Toaster` and `Field` are still single components. Leave them that way unless rebuilding one is the task.

## Component file structure

A single element (`Button`, `Badge`, `Input`, `Skeleton`, `EmptyState`) is one Vue file. An assembly is one folder: a file for each part the consumer places, and the parts that always travel together live inside `Content`. One variants module, one story file, one test file. `DataTable`, `FilterBar`, and `Pagination` stay widgets.

## Definition of done for a component

A component is not finished until all of these are true:

1. Renders all variants correctly in light and dark mode
2. Full keyboard support, and that support is documented
3. `addon-a11y` passes with zero violations
4. All props typed and JSDoc'd
5. Stories cover every variant, every state, and — for an assembly — the parts composed by the consumer
6. Interaction test for the primary behavior
7. Docs page written, including a **"when not to use"** section
8. **Visual QA:** `pnpm visual:check <Component>` (Storybook must be running), then **Read the PNGs** and fix anything that looks wrong in light or dark. Green tests are not enough.

## How to work on this

- **One concern per session.** Don't start a second polish cluster before the first is done.
- **API before implementation.** When given a prop interface, build to it exactly. If the API is wrong, say so before writing code rather than silently changing it.
- **Ask before adding dependencies.** Every dependency is a maintenance cost and a bundle-size cost.
- **Don't scaffold ahead.** No placeholder files for components or parts that are not being built. Empty stubs rot.
- **Don't migrate in passing.** Turning `Dialog` or `Select` into parts is its own breaking change. Finish the task that was asked.
- **When reviewing, list problems without fixing them** unless asked. The maintainer decides what matters.
- **Look at the pixels.** After UI changes, screenshot and inspect. Do not claim "looks fine" from code alone.

## Design decisions already made

Don't re-litigate these:

- **npm package, not copy-paste distribution.** shadcn-vue's model is deliberate and good, but rowkit ships as a versioned package.
- **Reka UI, not shadcn-vue as a dependency.** shadcn-vue is the reference for how styled parts sit on Reka. rowkit does not install it.
- **Assemblies follow Reka's custom API.** The consumer places root, trigger, content, and the text parts. Portal, overlay, and close can live inside content. See `docs/conventions.md`.
- **The set is the professional toolkit.** Components are added until a product interface can be built from rowkit. There is no fixed count, and tables are one part of that set, not the boundary of it.
- **MIT license.**
- **Tokens as a separate package**, so they can be consumed without importing components.

## Commands

```bash
pnpm build        # run first in a fresh clone; workspace deps resolve through dist
pnpm test         # unit, component and browser tests
pnpm lint         # eslint, type-aware
pnpm typecheck    # vue-tsc, strict
pnpm format       # prettier
pnpm size         # bundle budget, brotli

pnpm storybook    # then, in another terminal:
pnpm visual:check # screenshot default stories, light + dark → .visual-check/
pnpm visual:check Button  # scoped to one component

pnpm docs:props   # regenerate the props tables after touching a prop or its JSDoc
pnpm docs:agents  # regenerate packages/ui/AGENTS.md, likewise
```

`pnpm build` before anything else is not optional. The playground, the docs and
the type checker all resolve `rowkit` through `packages/ui/dist`, and an unbuilt
workspace produces a wall of confusing type errors rather than one clear one.

After any change that touches variants, tokens, layout, or dark mode: run
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
