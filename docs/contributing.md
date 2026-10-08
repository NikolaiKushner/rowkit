# Contributing

rowkit is a professional Vue 3 toolkit. The most useful contributions are bug
reports with a reproduction, and improvements to components that already exist.
New surface is welcome when a product interface is awkward without it — see
[the roadmap](/roadmap) for what is planned and what is already being built.
New assemblies follow [the conventions](/conventions): parts the consumer
places, not one component with flags.

## Getting set up

```bash
git clone https://github.com/NikolaiKushner/rowkit
cd rowkit
pnpm install
pnpm build        # workspace packages resolve through dist, so build first
```

Then whichever surface you need:

```bash
pnpm dev          # Nuxt playground, for manual testing
pnpm storybook    # the component workshop
pnpm docs:dev     # this site
pnpm test         # unit, component and browser tests (Windows 98)
```

**`pnpm build` before anything else** is not optional in a fresh clone. The
playground, the docs and the type checker all resolve `rowkit` through
`packages/ui/dist`, and an unbuilt workspace produces a wall of confusing type
errors rather than a clear one.

## The stages a change goes through

```bash
pnpm lint              # eslint, type-aware
pnpm format            # prettier
pnpm typecheck         # vue-tsc, strict
pnpm test              # the whole suite, in Windows 98
pnpm test:a11y:modern  # the browser tests and the a11y gate in the modern theme
pnpm size              # bundle budget, in brotli
```

CI runs all of these, with **build first** — for the reason above.

Then look at it. With Storybook running, `pnpm visual:check <Component>`
screenshots its stories into `.visual-check/`. Open the images, then switch the
Theme and Scheme controls in the Storybook toolbar and look again. Styling fails
silently; green tests are not enough.

## Conventions

Read [API conventions](/conventions) before designing anything with a public
surface. Prop naming, state ownership, event and slot shapes and the recurring
accessibility patterns are decided there, once, for every component. A change
that deviates needs a reason on the page, not just in a pull request.

The rules that get work sent back:

- **No hardcoded design values.** Every colour, space, radius, shadow and layer
  references a token. If none fits, propose one — `skeleton` was added exactly
  that way. A component never names a theme in its classes: a difference
  between Windows 98 and modern is a token with a value in every theme, and
  its JSDoc comment is its description on the Tokens page.
- **Variants live in `ComponentName.variants.ts`**, defined with `cva`. Never a
  long class string in a template.
- **Class names are written out in full.** Tailwind finds utilities by scanning
  for literal strings, so `bg-${variant}-subtle` is valid TypeScript that
  generates no CSS at all.
- **Every prop carries a JSDoc comment.** These generate the props tables and
  `AGENTS.md`; a comment restating the prop name is worse than none.
- **No `any`.** If typing is genuinely hard, ask rather than escaping the type
  system.
- **Build on the shared primitives** in `packages/ui/src/primitives/` for focus,
  dismissal, scroll lock and positioning. Do not re-solve them per component;
  extend a primitive, with its tests, when one falls short.

## What a finished component looks like

Nothing is marked Stable until all eight are true:

1. Renders every variant correctly in both themes, the modern one in light and
   dark
2. Full keyboard support, and that support is documented
3. `addon-a11y` passes with zero violations
4. All props typed and JSDoc'd
5. Stories cover every variant, every state and — for an assembly — the parts
   composed by the consumer
6. An interaction test for the primary behaviour
7. A docs page, including a **"when not to use"** section
8. Visual QA: `pnpm visual:check <Component>`, the screenshots looked at, in
   both themes and both schemes — no blurred bevel edges, no fractional
   pixels, no invisible focus ring

The seventh is not a formality. It is the most-read section on every page, and
writing it is usually where a scope problem surfaces.

## Generated files

These are derived from the source and will fail CI if edited by hand or left
stale:

```bash
pnpm docs:props      # the props table on every component page
pnpm docs:agents     # AGENTS.md, which ships inside the package
pnpm docs:reference  # @rowkit/tokens/reference and the Tokens page
pnpm icons:modern    # the modern theme's glyph stylesheet
```

Run whichever applies — after changing a prop, a JSDoc comment, an emit, a
model or a slot; a token or its comment; or an SVG in
`packages/ui/src/icons/modern/` — and commit the result.

## Changesets

Every change to the public API needs one:

```bash
pnpm changeset
```

Describe the change the way a consumer reading a changelog would want it
described — what changed and what it means for them, not which files moved. If
it fixes something that was broken in a released version, say what the symptom
was, because that is how someone recognises their own bug.

## Reporting a bug

The useful ones contain a reproduction: a StackBlitz, a minimal repo, or the
smallest component that shows it. rowkit's own failure mode is worth knowing
when you write the report — **the bugs here are usually silent**. A Tailwind
class that matches no utility, a token in the wrong namespace, a slot prop named
`name`: no error, no warning, wrong pixels. "It renders but looks wrong" is a
perfectly good bug report, and a screenshot beats a description.

## What is unlikely to be accepted

- A component outside the professional set in [the roadmap](/roadmap). There is
  no fixed count, but each one has to earn its place in a product interface.
- A new dependency, unless it replaces more code than it adds.
- A prop that lets a component make a multi-step decision for the consumer —
  auto-resetting the page, auto-sorting a server-paged table. Those belong in
  the application, and there is usually a composable answer instead.
- Icons that are not in the Figma set, or not drawn as pixel art on the
  integer grid. A new icon also needs its modern outline glyph, from the
  designer's Icons page, in `packages/ui/src/icons/modern/` under the icon's
  `data-icon` name; the icon tests fail without it. Icon slots take your own
  icons for anything else.

None of these are hard "no"s if the argument is good. Open an issue before
writing the code, though — it is a poor trade to review a pull request into a
decision that was already made.
