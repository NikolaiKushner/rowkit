# AGENTS.md

Instructions for coding agents working **on** rowkit.

> Looking for the API of the library itself? That is
> [`packages/ui/AGENTS.md`](./packages/ui/AGENTS.md) — generated from the source,
> shipped inside the npm package, and describing how to *use* the components.
> This file is about changing them.

## Read first

- **[`CLAUDE.md`](./CLAUDE.md)** — the working agreement: stack, hard rules,
  repository layout, definition of done. It is the authority; where this file and
  that one disagree, that one wins.
- **[`docs/conventions.md`](./docs/conventions.md)** — before designing anything
  with a public surface. Prop naming, state ownership, event and slot shapes and
  the recurring accessibility patterns are decided there, once, for every
  component.
- **[`ROADMAP.md`](./ROADMAP.md)** — before proposing a component. The scope is
  twelve, and that is a decision rather than a stage.

## Commands

```bash
pnpm build        # run first in a fresh clone; workspace deps resolve through dist
pnpm test         # unit, component and browser tests
pnpm lint         # eslint, type-aware
pnpm typecheck    # vue-tsc, strict
pnpm format       # prettier
pnpm size         # bundle budget, brotli

pnpm docs:props   # regenerate the props tables after touching a prop or its JSDoc
pnpm docs:agents  # regenerate packages/ui/AGENTS.md, likewise
```

`pnpm build` before anything else is not optional. The playground, the docs and
the type checker all resolve `rowkit` through `packages/ui/dist`, and an unbuilt
workspace produces a wall of confusing type errors rather than one clear one.

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

Everything in the definition of done in `CLAUDE.md`, plus a changeset for any
public API change:

```bash
pnpm changeset
```

Describe the change the way a consumer reading a changelog would want it
described — what changed and what it means for them, not which files moved.
