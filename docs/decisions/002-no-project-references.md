# 002 — No `tsc` project references between packages

**Status:** accepted
**Decided:** Phase 0a. Migrated here from `plan.md` prose in Phase 0b.

## Decision

The workspace packages do **not** use TypeScript project references. Each
package typechecks standalone, and `packages/ui` resolves `@rowkit/tokens`
through the pnpm symlink to its built `dist` — the same path a published
consumer takes.

## Reasons

Two rules make the obvious setup illegal rather than merely awkward:

- A referenced project may not disable emit (**TS6310**), and both
  `tsconfig.lib.json` files are `noEmit` — `vue-tsc -b` is a typecheck gate
  here, not an emitter. `vite-plugin-dts` turns emit on for declarations only.
- `paths` pointing at source is illegal under `composite` (**TS6307**).

Resolving through the built `dist` is also the honest arrangement: it exercises
the exact shape a consumer gets, so a broken `exports` map or a missing
declaration fails here rather than after publish.

## The consequence, which is load-bearing

**Tokens must be built before anything downstream runs.** `pnpm build` orders
this correctly through the workspace dependency graph, but a bare `pnpm
typecheck` — or `pnpm lint` — on a clean checkout does not.

This is not theoretical. CI originally ran Lint before Build and failed with 24
errors that said nothing about the code: with no `dist`, TypeScript types every
import of `@rowkit/tokens` and `rowkit` as `error`, and the type-aware rules
dutifully report every use of them as unsafe. **Build runs first in CI**, ahead
of lint, format, typecheck and test, for this reason. Any proposal to reorder
the CI gates has to answer this.

The playground needs the same treatment for a different reason: `defineNuxtConfig`
is a generated auto-import, so `nuxt prepare` runs in `postinstall`.

## Revisit when

Never, unless TypeScript relaxes TS6310 or TS6307. The arrangement costs one
ordering constraint in CI and buys an accurate consumer simulation.
