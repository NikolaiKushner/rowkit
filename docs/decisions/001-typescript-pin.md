# TypeScript pinned to 6.x, not 7

**Status:** accepted
**Decided:** Phase 0a. Migrated here from `plan.md` prose in Phase 0b.

## Decision

TypeScript stays on 6.x (currently `^6.0.3`). We do not take TypeScript 7.

## Reasons

`typescript-eslint@8` declares a peer range of `typescript: >=4.8.4 <6.1.0`.
Installing TypeScript 7 puts us outside it, and the practical cost is not a
warning — it is losing **type-aware linting** entirely.

That matters more here than the version number suggests. The rules that have
actually caught bugs in this repo are all type-aware: `no-unsafe-argument` and
`no-unsafe-member-access` are what surfaced the unbuilt-workspace-dependency
problem in CI, and `no-redundant-type-constituents` is what flagged the generic
`never` collapse in `DataTableRowKey`. A non-type-aware ESLint would have
reported none of them.

The newer language features in 7 buy nothing this library needs. The trade is
lopsided.

## Revisit when

`typescript-eslint` ships TypeScript 7 support in a stable release. At that
point this is a routine dependency bump with no argument attached.
